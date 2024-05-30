import { runController } from "../controllers/runController.js";
import express from 'express'

const router = express.Router();

router.post('/custom', runController);

export default router;