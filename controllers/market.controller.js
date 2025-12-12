import Food from "../models/food.js";
import logger from "../utils/logger.js";

// GET MARKET LISTING (Public/User)
export const getMarketplace = async (req, res, next) => {
    try {
        const { unit, minPrice, maxPrice, search } = req.query;

        let query = {};

        // Filter by Unit (bag, kilo, rubber)
        if (unit) {
            query.unit = unit;
        }

        // Filter by Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search by Name
        if (search) {
            query.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Only show items with stock? User didn't specify, but good practice.
        // query.Quantity = { $gt: 0 }; 

        const foods = await Food.find(query).sort({ createdAt: -1 });

        logger.info(`Fetched ${foods.length} items from market. Filters: ${JSON.stringify(req.query)}`);

        res.json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        next(error);
    }
};

// GET SINGLE ITEM
export const getMarketItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, data: food });
    } catch (error) {
        next(error);
    }
};
