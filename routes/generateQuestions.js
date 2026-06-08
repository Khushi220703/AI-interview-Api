// routes/interviewRoute.js

import express from "express";
import { generateQuestion } from "../controller/GenerateQuestionController.js";

const router = express.Router();



router.post("/generate", generateQuestion);

export default router;