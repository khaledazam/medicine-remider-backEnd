import express from "express";
import { register, login, getProfile, logout } from "../controllers/authController.js";
import { protect } from "../middlewars/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);



router.post("/logout", protect, logout);

export default router;
