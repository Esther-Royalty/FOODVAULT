
import jwt from "jsonwebtoken";


export const auth = (req, res, next) => {
  try {
    // Extract token from headers OR cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};



 













// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import { JWT_SECRET } from "../config/env.js";




// export const auth = async (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Access denied. No token provided" });
//   }

//   const token = authHeader.split(" ")[1];
//   if(!token) {
//     return res.status(401).json({ message: "Access denied. No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
   

//  const user = await User.findById(decoded._id)

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
    
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };



