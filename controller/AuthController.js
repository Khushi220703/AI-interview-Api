import User from "../schema/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error("JWT_SECRET is not defined");

const expiresIn = process.env.JWT_EXPIRETIME || "3d";

const generateToken = (email) => {
    return jwt.sign({ email }, secretKey, { expiresIn });
};

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password)
            return res.status(400).json({ message: "Please enter name, email, and password!" });

        const isUserExists = await User.findOne({ email });
        if (isUserExists)
            return res.status(400).json({ message: "Account already exists!" });

        const hashed = await bcrypt.hash(password, 12);
        await User.create({ email, name, password: hashed });

        const token = generateToken(email);
        res.status(201).json({ message: "Account created successfully!", token });
    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return res.status(400).json({ message: "Please enter email and password!" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "No account found with that email!" });

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(400).json({ message: "Invalid password!" });

        const token = generateToken(user.email);
        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        if (!email || !newPassword)
            return res.status(400).json({ message: "Please enter email and new password!" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "No account found with that email!" });

        const hashed = await bcrypt.hash(newPassword, 12);
        await User.updateOne({ email }, { password: hashed });

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email)
            return res.status(400).json({ message: "Please enter an email!" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "No account found with that email!" });

        await User.deleteOne({ email });
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const onBoarding = async (req, res) => {
  try {
    const {
      email,
      location,
      company,
      portfolioUrl,
      targetRole,
      experience,
      domain,
      dreamCompanies,
      skills,
      customSkills,
      interviewTypes,
      prepTimeline,
      extraContext,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updatedSkills = [
      ...skills,
      ...(customSkills
        ? customSkills.split(",").map((s) => s.trim())
        : []),
    ];

    await User.updateOne(
      { email },
      {
        $set: {
          location,
          currentCompany: company,
          portfolioUrl,
          targetRole,
          domain,
          skills: updatedSkills,
          interviewTypes,
          bio: extraContext,
          onboardingCompleted: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.log("Onboarding Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};