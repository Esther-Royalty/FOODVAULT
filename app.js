import dotenv from "dotenv";
dotenv.config({ path: ".env.development.local" });
import express from "express";
import { PORT } from "./config/env.js";
import { connectDB } from "./database/mongodb.js";
import cors from "cors";
import foodRoutes from "./routes/food.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import savingsRoutes from "./routes/savings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorHandler from "./middleware/errorHandler.js";




dotenv.config();

const app = express();
app.use(express.json());


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'https://foodvault-36sx.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);



app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/savings", savingsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.post("/api/v1/payments/webhook/paystack", express.raw({ type: "application/json"}), paymentRoutes)

app.use(errorHandler);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
}).catch((err) => {
  console.error("Failed to connect to DB:", err);
});

export default app;
