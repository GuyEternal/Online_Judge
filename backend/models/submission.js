import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    verdict: {
        type: String,
        default: 'PENDING',
    },
    time: {
        type: Number,
    },
    memory: {
        type: Number,
    },
    score: {
        type: Number,
    },
}, {
    timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;