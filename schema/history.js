import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activityType: {
      type: String,
      enum: [
        "Mock Interview",
        "DSA Practice",
        "Quiz",
        "Resume Review",
        "System Design",
        "HR Interview",
      ],
      required: true,
    },

    skill: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number, // minutes
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    result: {
      type: String,
      enum: ["Passed", "Failed", "Improved"],
      default: "Improved",
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const History = mongoose.model("History", historySchema);

export default History;