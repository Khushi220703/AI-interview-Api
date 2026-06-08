import express from "express";
const app = express();

import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/DBConfig.js";
import userModel from "./schema/user.js";
import user from "./routes/user.js"
import generateQuestion from "./routes/generateQuestions.js"
dotenv.config();

const PORT = 8080;

app.use(express.json());

// 👇 Add this
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/auth", user);

app.use("/api/interview", generateQuestion);

app.listen(PORT,()=>{

  console.log(`Hello I am from port ${PORT}`);
});