import User from "../schema/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { setOtp, getOtp, deleteOtp } from "../utils/otpStore.js";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error("JWT_SECRET is not defined");

const expiresIn = process.env.JWT_EXPIRETIME || "3d";

const generateToken = (email) => {
    return jwt.sign({ email }, secretKey, { expiresIn });
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.email);

    return res.status(201).json({
      success: true,
      token,
      user,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail address
    pass: process.env.EMAIL_PASS, // app password (not your normal password)
  },
});

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setOtp(email, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2><p>This OTP is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// export const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(400).json({
//         message: "Email is required",
//       });
//     }

//     // Temporary OTP
//     const otp = "123456";

//     return res.status(200).json({
//       success: true,
//       otp,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const record = getOtp(email);

    if (!record) {
      return res.status(400).json({
        message: "OTP not found. Please request a new one.",
      });
    }

    if (Date.now() > record.expiresAt) {
      deleteOtp(email);
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    deleteOtp(email);

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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

        res.status(200).json({ success: true, message: "Password updated successfully!" });
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
       console.log(req.body);
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