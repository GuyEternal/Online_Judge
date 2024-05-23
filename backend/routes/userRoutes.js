import { register, login, logout, checkAuth } from "../controllers/authController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", checkAuth);

export default router;