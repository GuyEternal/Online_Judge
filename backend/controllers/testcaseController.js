import TestCase from '../models/testcase.js';
import mongoose from 'mongoose';

// Create a new test case
export const createTestCase = async (req, res) => {
    const { problemId, input, output } = req.body;

    // Generate a unique testCaseId
    const testCaseId = new mongoose.Types.ObjectId();

    const testCase = new TestCase({
        testCaseId,
        problemId,
        input,
        output,
    });

    try {
        await testCase.save();
        res.status(201).json(testCase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get test cases by problemId
export const getTestCasesByProblem = async (req, res) => {
    const { problemId } = req.params;

    try {
        const cursor = TestCase.find({ problemId }).cursor();
        const testCases = [];

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            testCases.push(doc);
        }

        res.json(testCases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};