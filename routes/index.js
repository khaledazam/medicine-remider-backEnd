import express from "express";
import homeController from "../controllers/homeController.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./users.js";
import medicineRoutes from "./medicines.js";
import reminderRoutes from "./reminderRoutes.js";

const router = express.Router();

// Home route (بدون protect)
router.get("/", homeController.home);

// API Routes (كلها محمية بـ protect في server.js)
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/medicines", medicineRoutes);
router.use("/reminders", reminderRoutes);

// Not Found Handling for Routes
router.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default router;