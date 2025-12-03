import express from "express"
import {PORT} from "./config/env.js"
import {connectDB} from "./database/mongodb.js"
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes.js";
import savingsRoutes from "./routes/savPlan.routes.js";
import adminRoutes from "./routes/admin.routes.js";


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/savings", savingsRoutes);
app.use("/api/v1/admin", adminRoutes);


app.listen(PORT, () =>{
    connectDB();
  console.log("Server running...");
});

export default app;
