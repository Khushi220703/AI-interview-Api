import express from "express"
const router = express.Router();

router.post("/login");
router.post("/signup");
router.patch("/onBoarding");
router.delete("/deleteUser");
router.patch("/forgotPassword");

router.export;
