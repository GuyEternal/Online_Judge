import { runController } from "../controllers/runController.js";
import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Run route");
});
router.post('', runController);

export default router;