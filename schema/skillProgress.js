import mongoose from "mongoose";

const skillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "DSA",
        "Database",
        "System Design",
        "Machine Learning",
        "HR",
        "DevOps",
      ],
      default: "Frontend",
    },

    // Practice Stats
    totalProblemsSolved: {
      type: Number,
      default: 0,
    },

    easySolved: {
      type: Number,
      default: 0,
    },

    mediumSolved: {
      type: Number,
      default: 0,
    },

    hardSolved: {
      type: Number,
      default: 0,
    },

    totalHoursSpent: {
      type: Number,
      default: 0,
    },

    mockInterviewsGiven: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    confidenceLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // AI Analysis
    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    aiFeedback: [
      {
        feedback: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Skill Growth
    improvementPercentage: {
      type: Number,
      default: 0,
    },

    lastPracticed: {
      type: Date,
      default: null,
    },

    // Readiness
    companyReadiness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Ranking
    rank: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
      default: "Beginner",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SkillProgress = mongoose.model(
  "SkillProgress",
  skillProgressSchema
);

export default SkillProgress;