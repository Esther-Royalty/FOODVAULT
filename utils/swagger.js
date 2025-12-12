import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "../config/env.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FOODVAULT API",
            version: "1.0.0",
            description: "API Documentation for FOODVAULT Application",
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
