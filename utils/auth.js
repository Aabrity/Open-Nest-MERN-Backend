//PROTECT THE MIDDLEWARE
import User from '../model/user_model.js';
import asyncHandler from './async.js';
import jwt from 'jsonwebtoken';


//Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  // console.log("Request Headers:", req.headers);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  console.log("Token received:", token);
  // Make sure token exist
  if (!token) {
    
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("what", decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
  
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
});

// Grant access to specific roles , i.e publisher and admin

export const authorize = (...roles) => {
  return (req, res, next) => {
    ///check if it is admin or publisher. user cannot access
    //  console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.roles} is not authorized to access this route`,
      });
    }
    next();
  };
};
