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