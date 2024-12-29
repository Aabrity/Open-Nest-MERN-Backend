import Like from '../model/like_model.js';
import Listing from '../model/listing_model.js';
import { errorHandler } from '../utils/error.js';

// Like a Listing
export const likeListing = async (req, res, next) => {
  const { id } = req.params; 
  const userId = req.user.id; 

  try {
    // Check if the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    // Check if the user has already liked the listing
    const existingLike = await Like.findOne({ user: userId, listing: id });
    if (existingLike) {
      return next(errorHandler(400, 'You already liked this listing'));
    }

    // Create a new like
    await Like.create({ user: userId, listing: id });
    res.status(201).json({ message: 'Listing liked successfully' });
  } catch (error) {
    next(error);
  }
};

// Unlike a Listing
export const unlikeListing = async (req, res, next) => {
  const { id } = req.params; 
  const userId = req.user.id; 

  try {
    // Check if the like exists
    const existingLike = await Like.findOne({ user: userId, listing: id });
    if (!existingLike) {
      return next(errorHandler(400, 'You have not liked this listing'));
    }

    // Remove the like
    await Like.findByIdAndDelete(existingLike._id);
    res.status(200).json({ message: 'Listing unliked successfully' });
  } catch (error) {
    next(error);
  }
};

export const getLikesCount = async (req, res, next) => {
    const { id } = req.params; 
  
    try {
      const likesCount = await Like.countDocuments({ listing: id });
      res.status(200).json({ likesCount });
    } catch (error) {
      next(error);
    }
  };
  
