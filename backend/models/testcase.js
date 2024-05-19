import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    testCaseId: {
        type: String, required: true, unique: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true
    },
    input: {
        type: String, required: true
    },
    output: {
        type: String, required: true
    },
});

const TestCase = mongoose.model('TestCase', testCaseSchema);
export default TestCase;