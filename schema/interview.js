// models/Interview.js
import mongoose from "mongoose";

const questionFeedbackSchema = new mongoose.Schema({
  questionIndex: Number,
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  idealAnswerPoints: [String],
});

const evaluationSchema = new mongoose.Schema({
  overallScore: Number,
  categoryScores: {
    technicalAccuracy: Number,
    communicationClarity: Number,
    problemSolvingApproach: Number,
    depthOfKnowledge: Number,
    confidenceAndStructure: Number,
  },
  strongAreas: [String],
  weakAreas: [String],
  topicsToStudy: [String],
  questionFeedback: [questionFeedbackSchema],
  overallFeedback: String,
  hiringRecommendation: String,
});

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema", required: true },
    role: String,
    topic: String,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    experience: String,
    companyType: String,
    totalQuestions: Number,
    conversation: [
      {
        question: String,
        answer: String,
      },
    ],
    evaluation: evaluationSchema,
    status: { type: String, enum: ["in-progress", "completed", "abandoned"], default: "in-progress" },
    completedAt: Date,
    durationMinutes: Number,
  },
  { timestamps: true }
);

const Interview =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);

export default Interview;