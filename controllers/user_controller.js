import bcryptjs from 'bcryptjs';
import User from '../model/user_model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../model/listing_model.js';
import Comment from '../model/comment_model.js';  
import asyncHandler from '../utils/async.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const uploadImage = asyncHandler(async (req, res, next) => {
 

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {

    try {
      // Get the user data by ID
      const user = await User.findById(req.params.id);
  
      if (!user) return next(errorHandler(404, 'User not found!'));
  
      // Count the number of listings by the user
      const listingsCount = await Listing.countDocuments({ userRef: req.params.id });
  
      // Count the number of comments by the user
      const commentsCount = await Comment.countDocuments({ userRef: req.params.id });
  
      // Remove password from user object
      const { password, ...rest } = user._doc;
  
      // Return user data along with listings and comments count
      res.status(200).json({
        ...rest,
        listingsCount,
        commentsCount,
      });
    } catch (error) {
      next(error);
    }
  };







  export const getUserMob = async (req, res, next) => {
   
      try {
        // Get the user data by ID
        const user = await User.findById(req.params.id);
    
        if (!user) return next(errorHandler(404, 'User not found!'));
    
        // Count the number of listings by the user
        const listingsCount = await Listing.countDocuments({ userRef: req.params.id });
    
        // Count the number of comments by the user
        const commentsCount = await Comment.countDocuments({ userRef: req.params.id });
    
        // Remove password from user object
        const { password, ...rest } = user._doc;
    
        // Return user data along with listings and comments count
        res.status(200).json({
          success: true,
    data: user,
        });
      } catch (error) {
        next(error);
      }
    };
  

  

  
export const getMe = asyncHandler(async (req, res, next) => {
  // Show current user and don't show the password
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({  success: true,
    count: user.length,
    data: user, });
});



export const updateMobUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found with id " });
    }

    // Only include fields that are provided in the request
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    // Only update password if it's provided
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    user = await User.updateUser(req.params.id, updateData);

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
