import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateQuestion = async (req, res) => {
  try {
    const {
      role,
      topic,
      difficulty,
      experience,
      companyType,
      questionNumber,
      totalQuestions
    } = req.body;

    const prompt = `
You are a senior technical interviewer.

Interview Details:

Role: ${role}
Topic: ${topic}
Difficulty: ${difficulty}
Experience: ${experience}
Company Type: ${companyType}

Current Question: ${questionNumber}/${totalQuestions}

Rules:

1. Ask exactly ONE interview question.
2. Match the question to the candidate's experience.
3. Match the question style to the company type.
4. Do not provide answers.
5. Do not provide hints.
6. Do not ask multiple questions.
7. Return only the question text.
8. Questions should feel like real interviews.

Company Style Guidelines:

- Startup:
  Practical and implementation-focused.

- Service Based:
  Fundamentals and common scenarios.

- Product Based:
  Deep understanding and edge cases.

- FAANG:
  Advanced concepts, tradeoffs, scalability and internals.

Topic Focus:
${topic}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.status(200).json({
      success: true,
      question: response.text.trim(),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};