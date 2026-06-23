// routes/user.js
import express from "express";
import passport from "passport";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.create);

router.post("/login", userController.login);
;

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false, failureRedirect: "/users/user-not-found" }),
  userController.profile
);

router.get("/user-not-found", userController.userNotFound);

export default router;
