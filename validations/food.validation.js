import Joi from "joi";

export const addFoodSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    unit: Joi.string().valid("bag", "kilo", "rubber").default("bag"),
    Quantity: Joi.number().min(0).default(0), // Note: Model uses "Quantity" (capitalized), schema should match or controller should map
    // Recommendation: Refactor Model to use lowercase "quantity" for consistency, but for now matching Model
});
