import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

 


export const register = async (req, res) => {
    try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || (!email || !password))
      return res.status(400).json(({error: "All fields are required!"}))

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json ({message: "Email and password are required!"})
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist!" });
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) return res.status(400).json({ message: "Incorrect password!" });

    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin }, JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN });

//       const token = jwt.sign(
//   { _id: user._id },      // THIS PART WAS MISSING
//   JWT_SECRET,
//   { expiresIn: "1h" }
// );

    res.status(200).json({ message: "Login successful", token,
      data:{
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    },
  });
  } catch (error) {
    res.status(500).json({ message: "Could not login", error: error.message });
  }
};

