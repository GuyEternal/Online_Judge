import Problem from '../models/problem.js';

// Controller methods for handling problem-related operations
export const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find().sort({ createdAt: -1 });
        console.log("Problems sent!");
        console.log(problems);
        res.json(problems);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProblem = async (req, res) => {
    const problem = new Problem({
        name: req.body.name,
        statement: req.body.statement,
        sampleInput: req.body.sampleInput,
        sampleOutput: req.body.sampleOutput,
        difficulty: req.body.difficulty,
    });

    try {
        const newProblem = await problem.save();
        console.log(newProblem);
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(updatedProblem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
