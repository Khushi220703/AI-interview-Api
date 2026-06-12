import express from "express";
import {  sendOtp,  verifyOtp, signUp, login, forgotPassword, deleteUser, onBoarding } from "../controller/AuthController.js";

const router = express.Router();

router.post("/login", login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

// Add controllers later
router.post("/signup",signUp);
router.patch("/onBoarding", onBoarding);
router.delete("/deleteUser",deleteUser);
router.post("/forgotPassword",forgotPassword);

export default router;