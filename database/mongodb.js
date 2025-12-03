import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGODB_URI)
        console.log("connection to the database is successful")
    }catch (error){
        console.log("something went wrong", error)
    }
}