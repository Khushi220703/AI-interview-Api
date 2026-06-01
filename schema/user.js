import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Professional Info
    location: {
      type: String,
      default: "",
    },

    currentCompany: {
      type: String,
      default: "",
    },

    experience: {
      type: Number, // years
      default: 0,
    },

    domain: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Mobile Development",
        "Cyber Security",
        "UI/UX",
      ],
      default: "Frontend",
    },

    currentRole: {
      type: String,
      default: "",
    },

    // Links
    linkedinUrl: {
      type: String,
      default: "",
    },

    portfolioUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    // Career Goals
    targetCompany: {
      type: String,
      default: "",
    },

    dreamCompanies: {
      type: [String],
      default: [],
    },

    targetRole: {
      type: String,
      default: "",
    },

    // Skills
    skills: {
      type: [String],
      default: [],
    },

    preferredTechStack: {
      type: [String],
      default: [],
    },

    // Interview Preparation
    interviewLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    interviewTypes: {
      type: [String],
      default: [], // DSA, System Design, HR, React, Node.js etc.
    },

    // AI Notes
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // Platform Related
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;