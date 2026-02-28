// routes/user.js
import express from "express";
import passport from "passport";
import userController from "../controllers/userController.js";

const router = express.Router();

// 🚀 Register user
router.post("/register", userController.create);

// 🚀 Login user using Local Strategy
router.post("/login", userController.login);
;

// 🚀 Protected profile route using JWT
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false, failureRedirect: "/users/user-not-found" }),
  userController.profile
);

// 🚀 Fallback route if user not found or JWT invalid
router.get("/user-not-found", userController.userNotFound);

export default router;
