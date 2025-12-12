import mongoose from "mongoose";

// Define the schema for the "Food" collection
const foodSchema = new mongoose.Schema({
  // Name of the food item
  name: {
    type: String,      // The value must be a string
    required: true,    // This field must be provided
    unique: true       // No two food items can have the same name
  },

  // Price of the food item
  price: {
    type: Number,      // Must be a number
    required: true     // Cannot be empty
  },

  // Unit for the food item (e.g., bag, kg, rubber)
  unit: {
    type: String,      // Must be a string
    enum: ["bag", "kilo", "rubber"], // Allowed values
    default: "bag"     // If not provided, defaults to "bag"
  },

  // Available quantity of the food item
  Quantity: {
    type: Number,    // Must be a number
    default: 0,
    required: true
  }
},
  {
    // Automatically create `createdAt` and `updatedAt` timestamps
    timestamps: true
  });

// Export the model so it can be used in controllers
export default mongoose.model("Food", foodSchema);
