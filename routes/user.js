import express from "express"
import login from "../controller/AuthController"
const router = express.Router();

router.post("/login",login);
router.post("/signup");
router.patch("/onBoarding");
router.delete("/deleteUser");
router.patch("/forgotPassword");

router.export;
