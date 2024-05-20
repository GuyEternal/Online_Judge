// controllers/submission.js
import Submission from '../models/Submission.js';
import Problem from '../models/problem.js';
import User from '../models/user.js';

// Create a new submission
export const createSubmission = async (req, res) => {
    const { problemId, userId, code, verdict } = req.body;

    // Generate a unique submissionId
    const submissionId = new mongoose.Types.ObjectId();

    const submission = new Submission({
        submissionId,
        problemId,
        userId,
        code,
        verdict,
    });

    try {
        await submission.save();
        res.status(201).send(submission);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get submissions by problemId
export const getSubmissionsByProblem = async (req, res) => {
    const { problemId } = req.params;

    try {
        const submissionsCursor = await Submission.find({ problemId }).populate('userId', 'email').cursor();
        let submissions = [];
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        }
        res.json(submissions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get submissions by userId
export const getSubmissionsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const submissionsCursor = await Submission.find({ userId }).populate('problemId', 'name').cursor();
        let submissions = []
        for (let doc = await submissionsCursor.next(); doc != null; doc = await submissionsCursor.next()) {
            submissions.push(doc);
        }
        res.json(submissions);
    } catch (error) {
        res.status(500).send(error);
    }
};