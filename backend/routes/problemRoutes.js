
import express from "express";
import { getAllProblems, getProblemById, createProblem, updateProblem, deleteProblem } from "../controllers/problemController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Define routes for problems
router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', verifyToken, createProblem);
router.put('/:id', verifyToken, updateProblem);
router.delete('/:id', verifyToken, deleteProblem);

export default router;
