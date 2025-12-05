import mongoose from "mongoose";
  

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please enter your first name"]
    },

    lastname: {
        type: String,
        required: [true, "Please enter your last name"]
    },

    email: {
         type: String,
         required: true,
         unique: true,
  },

    password: {
        type: String,
        required: true,

    },

    isAdmin: {
        type: Boolean,
        default: false
    }

},

    {timestamps: true}
);


  export default mongoose.model("User", userSchema)