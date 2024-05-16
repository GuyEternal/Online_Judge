// Create a express server full with middleware and everything in this server.js file which is in the backend folder in which controllers folder, models folder and routes folder are present
// This server.js file is the main file of the backend folder
// Code:

import express, { json } from 'express';
// import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import pkg from 'mongoose';
const { connect, connection } = pkg;
// Load environment variables
config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Connect to MongoDB
connect(process.env.MONGO_URI);

const db = connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
import exampleRouter from './routes/example.js';
app.use('/api/example', exampleRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
