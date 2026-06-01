import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const URL = process.env.MONGODB_URL;

const connectDB = async () =>{

    try {
        
        mongoose.connect(URL);

        console.log("Successfully connected to the database.");
    } catch (error) {
        console.log("There is an error in connecting the DB", error);
        process.exit(1);
    }
};

export default connectDB;

