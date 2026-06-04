import express from "express";
import { signUp, login, forgotPassword, deleteUser, onBoarding } from "../controller/AuthController.js";

const router = express.Router();

router.post("/login", login);

// Add controllers later
router.post("/signup",signUp);
router.patch("/onBoarding", onBoarding);
router.delete("/deleteUser",deleteUser);
router.patch("/forgotPassword",onBoarding);

export default router;