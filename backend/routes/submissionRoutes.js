// routes/submission.js
import express from 'express';
import { createSubmission, getSubmissionsByProblem, getSubmissionsByUser } from '../controllers/submissionController.js';

const router = express.Router();

// Create a new submission
router.post('/', createSubmission);

// Get submissions by problemId
router.get('/problem/:problemId', getSubmissionsByProblem);

// Get submissions by userId
router.get('/user/:userId', getSubmissionsByUser);

export default router;
