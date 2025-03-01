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



export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params; // Listing ID

    const comments = await Comment.find({ listing: id })
      // .populate('user', 'name email') // Populate user details (name, email)
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

    if (req.user.isAdmin) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('Comment has been deleted!');
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


export const getallcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};






export const getMobComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};



export const getMobComment = async (req, res, next) => {
  try {
    const { id } = req.params; // Listing ID

    const comment = await Comment.find({ listing: id })

    if (!comment) {
      return res.status(401).json({ message: "cannot find the comment with " });
    }

    res.status(200).json({ 
      success: true,
      count: comment.length,
      data: comment,
     });
  } catch (err) {
    next(err);
  }
};



export const createMobComment = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};



export const updateMobComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Course not found with id of ${req.params.id}" });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};



export const deleteMobComment = async (req, res, next) => {
  // delete course by id
  await Comment.findByIdAndDelete(req.params.id).then((comment) => {
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Course not found with id of ${req.params.id}" });
    }
    res.status(200).json({ success: true, data: comment });
  });
};


