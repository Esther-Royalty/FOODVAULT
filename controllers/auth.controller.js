import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
 


export const register = async (req, res) => {
    try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || (!email || !password))
      return res.status(400).json(({error: "First name, last name, email & password required!"}))

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Auth.create({
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



//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json ({message: "Please enter correct credentials!"})
    }

    const User = await Auth.findOne({ email });
    if (!User) return res.status(400).json({ message: "User does not exist!" });

    const correctPassword = await bcrypt.compare(password, User.password);
    if (!correctPassword) return res.status(400).json({ message: "Incorrect password!" });

    const token = jwt.sign(
      { id: User._id, isAdmin: User.isAdmin }, JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({ message: "Login successful", token,
      data:{
      id: User.id,
      firstname: User.firstname,
      lastname: User.lastname,
      email: User.email
    },
  });
  } catch (error) {
    res.status(500).json({ message: "Could not login", error });
  }
};

