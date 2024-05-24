import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    sampleInput: {
        type: String,
        required: true
    },
    sampleOutput: {
        type: String,
        required: true
    },
    difficulty: String
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;