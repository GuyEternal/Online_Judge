import express from 'express';
import { createTestCase, getTestCasesByProblem } from '../controllers/testcaseController.js';

const router = express.Router();

// Create a new test case
router.post('/', createTestCase);

// Get test cases by problemId
router.get('/problem/:problemId', getTestCasesByProblem);

export default router;
