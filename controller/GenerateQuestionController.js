
import { GoogleGenAI } from "@google/genai";
import Interview from "../schema/interview.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuestion = async (req, res) => {
  try {
    const {
      userId,
      role,
      topic,
      difficulty,
      experience,
      companyType,
      totalQuestions = 10,
    } = req.body;

    // ── Validation ───────────────────────────────────────────────
    if (!userId || !role || !topic || !difficulty || !experience || !companyType) {
      return res.status(400).json({
        success: false,
        message: "userId, role, topic, difficulty, experience, companyType are required",
      });
    }

    // ── Generate ALL questions at once ───────────────────────────
    const prompt = `
You are a senior technical interviewer at a ${companyType} company.

Interview Details:
- Role: ${role}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Experience Level: ${experience}
- Company Type: ${companyType}
- Total Questions: ${totalQuestions}

Company Style Guidelines:
- Startup: Practical, implementation-focused, real-world problem solving.
- Service Based: Fundamentals, common scenarios, standard patterns.
- Product Based: Deep understanding, edge cases, system design thinking.
- FAANG: Advanced concepts, tradeoffs, scalability, internals, optimization.

Difficulty Guidelines:
- Easy: Basic definitions, simple implementations, common use cases.
- Medium: Applied knowledge, debugging scenarios, moderate complexity.
- Hard: Deep internals, architectural tradeoffs, performance optimization.

Rules:
1. Generate exactly ${totalQuestions} questions.
2. Each question must test a DIFFERENT concept within ${topic}.
3. No repeated or similar questions.
4. Questions should progressively get harder (Q1 easiest, Q${totalQuestions} hardest).
5. Match style strictly to ${companyType} guidelines.
6. Last 2 questions should be the most challenging.
7. Return ONLY a valid JSON array of strings. No markdown, no explanation, no backticks.

Example format:
["Question 1 text", "Question 2 text", "Question 3 text"]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const rawText = response.text.trim().replace(/```json|```/g, "");

    let questions;
    try {
      questions = JSON.parse(rawText);
      if (!Array.isArray(questions) || questions.length === 0) throw new Error();
    } catch {
      return res.status(500).json({
        success: false,
        message: "AI returned malformed questions. Please retry.",
        raw: rawText,
      });
    }

    // ── Save Interview to DB ─────────────────────────────────────
    const interview = await Interview.create({
      userId,
      role,
      topic,
      difficulty,
      experience,
      companyType,
      totalQuestions: questions.length,
      questions,          // store all questions
      conversation: [],   // answers filled later
      status: "in-progress",
    });

    res.status(201).json({
      success: true,
      message: "Interview started successfully",
      data: {
        interviewId: interview._id,
        questions,         // send all to frontend
        totalQuestions: questions.length,
        topic,
        role,
        difficulty,
      },
    });

  } catch (error) {
    console.error("generateQuestion error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while starting the interview",
    });
  }
};