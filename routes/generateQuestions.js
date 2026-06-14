// routes/interview.js
import express from "express";
import { generateQuestion } from "../controller/GenerateQuestionController.js";
import { evaluateInterview } from "../controller/EvaluateInterview.js";
import { getUserInsights } from "../controller/AnalyticsController.js";

const router = express.Router();

router.post("/generate-question",  generateQuestion);
router.post("/evaluate", evaluateInterview);
router.get("/insights",  getUserInsights);

export default router;