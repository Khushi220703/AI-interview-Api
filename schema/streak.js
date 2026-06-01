import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    totalPracticeDays: {
      type: Number,
      default: 0,
    },

    lastActiveDate: {
      type: Date,
      default: null,
    },

    streakHistory: [
      {
        date: {
          type: Date,
        }
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Streak = mongoose.model("Streak", streakSchema);

export default Streak;