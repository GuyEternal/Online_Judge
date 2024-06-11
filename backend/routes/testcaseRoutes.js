import express from 'express';
import { createTestCase, getTestCasesByProblem, createTestCasesByProblem } from '../controllers/testcaseController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create a new test case
router.post('/', verifyToken, createTestCase);
router.post('/problem/:problemId', verifyToken, createTestCasesByProblem);
// Get test cases by problemId
router.get('/problem/:problemId', getTestCasesByProblem);

export default router;
