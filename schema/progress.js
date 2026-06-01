import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Total Platform Stats
    totalHoursPracticed: {
      type: Number,
      default: 0,
    },

    totalMockInterviews: {
      type: Number,
      default: 0,
    },

    totalQuestionsSolved: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    // Monthly Analytics
    monthlyPerformance: [
      {
        month: {
          type: String, // Example: "May-2026"
        },

        hoursPracticed: {
          type: Number,
          default: 0,
        },

        mockInterviews: {
          type: Number,
          default: 0,
        },

        questionsSolved: {
          type: Number,
          default: 0,
        },

        averageScore: {
          type: Number,
          default: 0,
        },

        improvementPercentage: {
          type: Number,
          default: 0,
        },

        strongestSkill: {
          type: String,
          default: "",
        },

        weakestSkill: {
          type: String,
          default: "",
        },
      },
    ],

    // Skill Based Analytics
    skillAnalytics: [
      {
        skill: {
          type: String,
        },

        score: {
          type: Number,
          default: 0,
        },

        practiceHours: {
          type: Number,
          default: 0,
        },

        improvementPercentage: {
          type: Number,
          default: 0,
        },
      },
    ],

    // AI Insights
    aiFeedback: [
      {
        feedback: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;