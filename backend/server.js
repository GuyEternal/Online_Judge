// Create a express server full with middleware and everything in this server.js file which is in the backend folder in which controllers folder, models folder and routes folder are present
// This server.js file is the main file of the backend folder
// Code:

import express, { json } from 'express';
// import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import pkg from 'mongoose';
import cookieParser from 'cookie-parser';
const { connect, connection } = pkg;
import problemRouter from './routes/problemRoutes.js';
import submissionRouter from './routes/submissionRoutes.js';
import testcaseRouter from './routes/testcaseRoutes.js';
import userRouter from './routes/userRoutes.js';
import runRouter from './routes/runRoutes.js';
// Load environment variables
config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connect(process.env.MONGO_URI);

const db = connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/problem', problemRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/testcase', testcaseRouter);
app.use('/api/auth', userRouter);
app.use('/api/run', runRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
