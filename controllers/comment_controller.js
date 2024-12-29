import Comment from '../model/comment_model.js';
import Listing from '../model/listing_model.js';
import { errorHandler } from '../utils/error.js';

// Add a comment
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params; // Listing ID
    const { comment } = req.body;

    // Check if the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Create a new comment
    const newComment = await Comment.create({
      listing: id,
      user: req.user.id, // Authenticated user's ID from verifyToken
      comment,
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Get all comments for a listing
export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params; // Listing ID

    const comments = await Comment.find({ listing: id })
      .populate('user', 'name email') // Populate user details (name, email)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params; // Comment ID

    const comment = await Comment.findById(id);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found!'));
    }

    // Ensure only the author can delete the comment
    if (req.user.id !== comment.user.toString()) {
      return next(errorHandler(401, 'You can only delete your own comments!'));
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Comment has been deleted!' });
  } catch (error) {
    next(error);
  }
};
