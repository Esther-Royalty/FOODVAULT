import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

beforeAll(async () => {
    // Connect to a test database or use existing one carefully
    // For safety, let's use a distinct test URI if available, or mock
    if (!process.env.MONGO_URI) {
        console.warn("MONGO_URI not found, testing might fail if DB connection is needed");
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});
