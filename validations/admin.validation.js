import Joi from "joi";

export const planIdSchema = Joi.object({
    planId: Joi.string().hex().length(24).required().messages({
        "string.length": "Invalid Plan ID format",
        "string.hex": "Invalid Plan ID format",
    }),
});
