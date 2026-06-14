// controllers/evaluateInterview.js
import { GoogleGenAI } from "@google/genai";
import Interview from "../schema/interview.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const evaluateInterview = async (req, res) => {
  try {
    const {
      interviewId,
      conversation,
      role,
      topic,
      difficulty,
      experience,
      companyType,
      durationMinutes,
    } = req.body;

    // ── Validation ──────────────────────────────────────────────
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({
        success: false,
        message: "conversation array is required and cannot be empty",
      });
    }

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "interviewId is required",
      });
    }

    // ── Build Prompt ─────────────────────────────────────────────
    const formattedQA = conversation
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join("\n\n");

    const prompt = `
You are a senior technical interviewer at a ${companyType || "top tech"} company.
Evaluate this completed technical interview strictly and fairly.

Interview Context:
- Role: ${role}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Experience Level: ${experience}
- Total Questions: ${conversation.length}

Q&A Session:
${formattedQA}

Evaluation Rules:
1. Be strict but fair. A score of 80+ means truly impressive answers.
2. Penalize vague, incomplete, or incorrect answers heavily.
3. Reward depth, clarity, and practical knowledge.
4. Base scores only on what was actually said, not potential.
5. topicsToStudy must be specific subtopics, not generic ("Node.js Streams" not "Node.js").

Return ONLY a valid JSON object. No markdown, no explanation, no backticks.

{
  "overallScore": <0-100, weighted average of all category scores>,
  "categoryScores": {
    "technicalAccuracy": <0-100>,
    "communicationClarity": <0-100>,
    "problemSolvingApproach": <0-100>,
    "depthOfKnowledge": <0-100>,
    "confidenceAndStructure": <0-100>
  },
  "strongAreas": ["max 3 specific areas they did well"],
  "weakAreas": ["max 3 specific areas needing improvement"],
  "topicsToStudy": ["5-6 specific subtopics to study based on weak answers"],
  "questionFeedback": [
    {
      "questionIndex": <0-based index>,
      "question": "<the question>",
      "score": <0-10>,
      "feedback": "<what was good and what was missing in 1-2 sentences>",
      "idealAnswerPoints": ["3-4 key points a perfect answer would cover"]
    }
  ],
  "overallFeedback": "<3-4 sentence honest summary of performance, strengths, and what to improve>",
  "hiringRecommendation": "<exactly one of: Strong Hire | Hire | Maybe | No Hire>",
  "estimatedLevel": "<exactly one of: Junior | Mid | Senior | Principal>"
}
`;

    // ── Call Gemini ──────────────────────────────────────────────
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const rawText = geminiResponse.text.trim().replace(/```json|```/g, "");

    let evaluation;
    try {
      evaluation = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", rawText);
      return res.status(500).json({
        success: false,
        message: "AI returned malformed JSON. Please retry.",
        raw: rawText,
      });
    }

    // ── Validate Score Range ─────────────────────────────────────
    const clamp = (val) => Math.min(100, Math.max(0, Number(val) || 0));
    evaluation.overallScore = clamp(evaluation.overallScore);
    Object.keys(evaluation.categoryScores || {}).forEach((key) => {
      evaluation.categoryScores[key] = clamp(evaluation.categoryScores[key]);
    });

    // ── Save to DB ───────────────────────────────────────────────
    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        evaluation,
        conversation,
        status: "completed",
        completedAt: new Date(),
        ...(durationMinutes && { durationMinutes }),
      },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found with the provided interviewId",
      });
    }

    // ── Response ─────────────────────────────────────────────────
    res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      data: {
        interviewId: interview._id,
        overallScore: evaluation.overallScore,
        hiringRecommendation: evaluation.hiringRecommendation,
        estimatedLevel: evaluation.estimatedLevel,
        categoryScores: evaluation.categoryScores,
        strongAreas: evaluation.strongAreas,
        weakAreas: evaluation.weakAreas,
        topicsToStudy: evaluation.topicsToStudy,
        questionFeedback: evaluation.questionFeedback,
        overallFeedback: evaluation.overallFeedback,
      },
    });

  } catch (error) {
    console.error("evaluateInterview error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong during evaluation",
    });
  }
};