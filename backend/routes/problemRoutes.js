
import express from "express";
import { getAllProblems, getProblemById, createProblem, updateProblem, deleteProblem } from "../controllers/problemController.js";

const router = express.Router();

// Define routes for problems
router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', createProblem);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;
