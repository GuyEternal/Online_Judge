// controllers/submission.js
import Submission from '../models/Submission.js';
import Problem from '../models/problem.js';
import mongoose from 'mongoose';
import User from '../models/user.js';

// Create a new submission
export const createSubmission = async (req, res) => {
    const { problem, user, username, problemName, code, language, time, memory, score, verdict } = req.body;

    // Generate a unique submissionId
    const submissionId = new mongoose.Types.ObjectId();

    const submission = new Submission({
        submissionId,
        username,
        problemName,
        problem,
        user,
        code,
        language,
        time,
        memory,
        score,
        verdict,
    });

    try {
        await submission.save();
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
        const submissionsCursor = Submission.find({ problemId }).populate('userId', 'email').cursor();
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
        const submissionsCursor = Submission.find({ username }).populate().cursor();
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

    try {
        const problemObj = await Problem.findById(problemId);
        const problem = problemObj.name;
        const submissionsCursor = Submission.find({ username, problem }).populate().cursor();
        let submissions = []
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        } await submissionsCursor.close();
        res.json({ subs: submissions });

    } catch (error) {
        res.status(500).send(error);
    }
}