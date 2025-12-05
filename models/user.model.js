
import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },   
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },

  selectedFoodPackages: { 
    type: [mongoose.Schema.Types.ObjectId],
    ref: "FoodPackage",
   default: [] 
   },

   customPackageItems: [{
    name: String,
    quantity: Number,
    unit: String
  }],

  hasCompletedPackageSelection: { 
    type: Boolean, 
    default: false 
  }
}, 
{ timestamps: true }); 

export default mongoose.model("User", userSchema);



