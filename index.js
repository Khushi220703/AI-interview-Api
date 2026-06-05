import express from "express";
const app = express();
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/DBConfig.js";
import userModel from "./schema/user.js";
import user from "./routes/user.js"
dotenv.config();

const PORT = 8080;


app.use(express.json());
connectDB();

app.get("/", (req,res)=>{

  res.send("Hello world!");
});

app.use("/api/auth", user);

app.listen(PORT,()=>{

  console.log(`Hello I am from port ${PORT}`);
});