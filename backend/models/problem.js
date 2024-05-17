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
    difficulty: String,
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }]
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;