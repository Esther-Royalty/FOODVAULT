import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import "./setup.js";

// Mock database interactions if needed, or use a test DB
// For this example, we assume we can hit the DB defined in .env (careful!)
// A better approach is using mongodb-memory-server, but for now we test against the connected DB
// Ensure we cleanup

describe("Auth Endpoints", () => {

    const testUser = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        phone: "1234567890"
    };

    beforeAll(async () => {
        // Cleanup potentially existing user
        await User.deleteMany({ email: testUser.email });
    });

    afterAll(async () => {
        await User.deleteMany({ email: testUser.email });
        await mongoose.connection.close();
    });

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.data.user).toHaveProperty("email", testUser.email);
    });

    it("should login the user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.data).toHaveProperty("tokens");
    });

    it("should fail login with wrong password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toEqual(401);
    });
});
