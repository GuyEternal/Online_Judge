import express from 'express';
import { createTestCase, getTestCasesByProblem, createTestCasesByProblem } from '../controllers/testcaseController.js';

const router = express.Router();

// Create a new test case
router.post('/', createTestCase);
router.post('/problem/:problemId', createTestCasesByProblem);
// Get test cases by problemId
router.get('/problem/:problemId', getTestCasesByProblem);

export default router;
