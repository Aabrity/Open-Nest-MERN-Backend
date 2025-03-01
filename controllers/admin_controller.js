import User from '../model/user_model.js';
import Listing from '../model/listing_model.js';
import { errorHandler } from '../utils/error.js';

// Get all users with their subscription status
export const getAllUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied. Admins only.'));
    }

    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get all listings for all users
export const getAllListings = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied. Admins only.'));
    }

    const listings = await Listing.find().populate('userRef', 'username email'); // Populate user details
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
// Delete a user (Admin Only)
export const deleteUserByAdmin = async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Access denied. Admins only.'));
      }
  
      const userId = req.params.id;
  
      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, 'User not found!'));
      }
  
      await User.findByIdAndDelete(userId);
  
      // Optionally delete user's listings
      await Listing.deleteMany({ userRef: userId });
  
      res.status(200).json({ message: `User with ID ${userId} has been deleted.` });
    } catch (error) {
      next(error);
    }
  };

  export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUsers = await User.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (error) {
      next(error);
    }
  };