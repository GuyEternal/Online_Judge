import Submission from '../models/submission.js';
import Problem from '../models/problem.js';
import mongoose from 'mongoose';
import TestCase from '../models/testcase.js';
import user from '../models/user.js';
import { unlink } from 'fs';
import { execCPP } from '../utils/execCPP.js';
import { execPY } from '../utils/execPY.js';
import { execJAVA } from '../utils/execJAVA.js';
import { generateFile } from '../utils/generateFile.js';


export const createSubmission = async (req, res) => {
    console.log(req.body);
    const { pid } = req.params;
    const problemId = pid;
    const problem = req.body.problem;
    const code = req.body.code;
    const lang = req.body.language;
    const username = req.body.username;
    let verdict = "Accepted"; // Assume AC (Accepted) initially
    console.log("request succesfully recevied");
    // Get all testcases
    let testcases = [];
    try {
        const cursor = TestCase.find({ problemId }).cursor();
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            testcases.push(doc);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, result: "Error in fetching testcases" });
    }
    console.log("testcases succesfully retreived" + "no of testcases: " + testcases.length);

    const { filePath, dirOutput, randomString } = generateFile(code, lang);
    let totalTime = 0;
    for (const testcase of testcases) {
        const customInput = testcase.input;
        const requiredOutput = testcase.output;
        let op;
        console.log("testcase: " + testcase + "lang:" + lang);
        switch (lang) {
            case "cpp":
                try {
                    op = await execCPP(dirOutput, filePath, customInput, randomString);
                } catch (error) {
                    op.error = error.message;
                }
                break;
            case "py":
                try {
                    op = await execPY(dirOutput, filePath, customInput, randomString);
                } catch (error) {
                    op.error = error.message;
                }
                break;
            case "java":
                try {
                    op = await execJAVA(dirOutput, filePath, customInput, randomString);
                } catch (error) {
                    op.error = error.message;
                }
                break;
            default:
                return res.json({ error: "Invalid language" });
        }

        if (typeof op.output === 'object' && op.output !== null) {
            op.output = JSON.stringify(op.output);
        }

        // Check for TLE
        if (op.time > 1500) {
            console.log("TLE found!!");
            verdict = "TLE";
            break; // Exit the loop if TLE is found
        }
        else if (op.error.message.match("Compilation Error") !== null) {
            verdict = "Compilation Error";
            break;
        }
        else if (op.error.message.match("Runtime Error") !== null) {
            verdict = "Runtime Error";
            break;
        }
        console.log("op.error.message:" + op.error.message);
        // Check for correct output
        let opLines = op.output.endsWith('\n') ? op.output.slice(0, -1).split('\n') : op.output.split('\n');
        let requiredLines = requiredOutput.endsWith('\n') ? requiredOutput.slice(0, -1).split('\n') : requiredOutput.split('\n');

        let isMatch = opLines.length === requiredLines.length && opLines.every((val, index) => val.trim() === requiredLines[index].trim());
        if (!isMatch) {
            console.log("Testcase doesn't match:" + op.output + "!==" + requiredOutput)
            verdict = "WA"; // Wrong Answer
            break;
        }
        // If output matches requiredOutput, continue to the next testcase
        console.log("move on to the next testcase-->>" + totalTime);
        totalTime += op.time;
    }
    switch (lang) {
        case "cpp":
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .cpp file")
                    console.log(err);
                } else {
                    console.log("deleted .cpp file succesfully")
                }
            });
            unlink(dirOutput + '/' + randomString + '.exe', (err) => {
                if (err) {
                    console.log("error in deleting .exe file")
                    console.log(err);
                } else {
                    console.log("deleted .exe file succesfully")
                }
            });
            break;
        case "py":
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .py file")
                    console.log(err);
                } else {
                    console.log("deleted .py file succesfully")
                }
            });
            break;
        case "java":
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .java file")
                    console.log(err);
                } else {
                    console.log("deleted .java file succesfully")
                }
            });
            unlink(dirOutput + '/' + randomString + '.class', (err) => {
                if (err) {
                    console.log("error in deleting .class file")
                    console.log(err);
                } else {
                    console.log("deleted .class file succesfully")
                }
            });
            break;
        default:
            return res.json({ error: "Invalid language" });
    }


    const USER = await user.findOne({ username: username });
    console.log("User found!");
    // Save the submission with the verdict
    const submission = new Submission({
        username,
        user: USER._id,
        problem: problemId,
        problemName: problem.name,
        code,
        language: lang,
        time: totalTime,
        memory: 0,
        verdict: verdict,
    });
    console.log("Submission created in backend!!")
    try {
        await submission.save();
        console.log("Submission saved in DB!! " + verdict)
        res.status(201).send(submission);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getAllSubmissions = async (req, res) => {
    try {
        const submissionsCursor = Submission.find().sort({ createdAt: -1 }).populate().cursor();
        let submissions = [];
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        } await submissionsCursor.close();
        res.json({ subs: submissions });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get submissions by problemId
export const getSubmissionsByProblem = async (req, res) => {
    const { problemId } = req.params;

    try {
        const submissionsCursor = Submission.find({ problemId }).sort({ createdAt: -1 }).populate('userId', 'email').cursor();
        let submissions = [];
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        } await submissionsCursor.close();
        res.json({ subs: submissions });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get submissions by userId
export const getSubmissionsByUser = async (req, res) => {
    const username = req.params.username;

    try {
        const submissionsCursor = Submission.find({ username }).sort({ createdAt: -1 }).populate().cursor();
        let submissions = []
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        } await submissionsCursor.close();
        res.json({ subs: submissions });

    } catch (error) {
        res.status(500).send(error);
    }
};

export const getSubmissionsByUserAndProblem = async (req, res) => {
    const { username, problemId } = req.params;
    console.log(username, problemId);
    try {
        const problemObj = await Problem.findById(problemId);
        const problem = problemObj.name;
        const submissionsCursor = Submission.find({ username, problem: problemId }).sort({ createdAt: -1 }).populate().cursor();
        let submissions = []
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        } await submissionsCursor.close();
        res.json({ subs: submissions });

    } catch (error) {
        res.status(500).send(error);
    }
}