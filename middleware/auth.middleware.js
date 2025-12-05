
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";



export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // FIX: support any field name
    const userId = decoded._id || decoded.id || decoded.userId;

    const user = await User.findById(userId);

        console.log("JWT SECRET being used:", JWT_SECRET);
        console.log("Decoded token:", decoded);
        console.log("Looking for user:", userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    console.log("JWT SECRET being used:", JWT_SECRET);
console.log("Decoded token:", decoded);
console.log("Looking for user:", userId);

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
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



