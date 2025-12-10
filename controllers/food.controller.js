import Food from "../models/Food.js";


// ADMIN: Add a food item
export const addFood = async (req, res) => {
  try {
    // Destructure name, price, and unit from the request body
    const { name, price, unit } = req.body;

    // Create a new food document in the database
    const food = await Food.create({ name, price, unit });

    // Respond with success and the created food
    res.status(201).json({
      message: "Food added successfully",
      food
    });
  } catch (error) {
    // If any error occurs, respond with status 500 and an error message
    res.status(500).json({ message: "Failed to add food" });
  }
};


// USER: Get all foods
export const getAllFoods = async (req, res) => {
  try {
    // Fetch all food documents from the database
    const foods = await Food.find();

    // Respond with the list of foods
    res.status(200).json(foods);
  } catch (error) {
    // If any error occurs, respond with status 500 and an error message
    res.status(500).json({ message: "Failed to fetch food list" });
  }
};

