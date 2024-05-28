// routes/submission.js
import express from 'express';
import { createSubmission, getAllSubmissions, getSubmissionsByProblem, getSubmissionsByUser, getSubmissionsByUserAndProblem } from '../controllers/submissionController.js';

const router = express.Router();

// Create a new submission
router.post('/', createSubmission);
// router.post('/submit', createSubmission);

router.get('/', getAllSubmissions);

// Get submissions by problemId
router.get('/problem/:problemId', getSubmissionsByProblem);

// Get submissions by userId
router.get('/user/:username', getSubmissionsByUser);

router.get('/user/:username/problem/:problemId', getSubmissionsByUserAndProblem);

// Create a submission and run it on all testcases i.e. submit the code

export default router;
