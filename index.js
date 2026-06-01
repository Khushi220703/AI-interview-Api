import express from "express";
const app = express();
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/DBConfig.js";
import userModel from "./schema/user.js";

dotenv.config();

const PORT = 8080;

connectDB();

app.get("/", (req,res)=>{

  res.send("Hello world!");
});


app.listen(PORT,()=>{

  console.log(`Hello I am from port ${PORT}`);
});