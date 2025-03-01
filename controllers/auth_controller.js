import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../model/user_model.js';
import asyncHandler from '../utils/async.js';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';



dotenv.config();




export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password , avatar} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword , avatar});
  try {
    await newUser.save();
    const transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      port:587,
      secure:false,
      protocol:"smtp",
      auth:{
        user:"aabrityd@gmail.com",
        pass:"hsccsgpttdywyous"
      }
    })
    const info = await transporter.sendMail({
      from:"aabrityd@gmail.com",
      to: newUser.email,
      subject:"User Registration",
      html: `
      <h1> Your Registration has been Completed</h1>
      <p> Your User Id is ${newUser.id} </p>
      `
    })
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  // Check if student exists
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
  
});

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Set user as verified
    user.isVerified = true;
    user.verificationToken = null; // Clear the token
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};



export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id, isAdmin:validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(validUser);

      sendTokenResponse(validUser, 200, res); 
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

export const getMe = asyncHandler(async (req, res, next) => {
  // Show current user and don't show the password
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json(user);
});




export const uploadImage = asyncHandler(async (req, res, next) => {
 

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});


// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const id = user._id;

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
      id
    });
};

export const getUserProfile = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
