import Like from '../model/like_model.js';
import Listing from '../model/listing_model.js';
import { errorHandler } from '../utils/error.js';



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
      // Unliking the listing
      await Like.findByIdAndDelete(existingLike._id);
      
      // Optional: Update like count in the listing (if you want to track it)
      listing.likesCount -= 1;
      await listing.save();

      return res.status(200).json({ 
        message: 'Listing unliked successfully',
        likesCount: listing.likesCount 
      });
    }

    // Liking the listing
    await Like.create({ user: userId, listing: id });
    
    // Optional: Update like count in the listing (if you want to track it)
    listing.likesCount += 1;
    await listing.save();

    res.status(201).json({ 
      message: 'Listing liked successfully',
      likesCount: listing.likesCount 
    });

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
  



export const getMobLikes = async (req, res, next) => {
  try {
    const likes = await Like.find();

    res.status(200).json({
      success: true,
      count: likes.length,
      data: likes,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};



export const getMobLike = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const like = await Like.find({ listing: id })

    if (!like) {
      return res.status(401).json({ message: "cannot find the course with " });
    }

    res.status(200).json({ 
      success: true,
      count: like.length,
      data: like,
    });
  } catch (err) {
    next(err);
  }
};



export const createMobLike = async (req, res, next) => {
  try {
    const like = await Like.create(req.body);

    res.status(201).json({
      success: true,
      data: like,
    });
  } catch (err) {
    next(err);
  }
};






export const deleteMobLike = async (req, res, next) => {
  // delete course by id
  await Like.findByIdAndDelete(req.params.id).then((like) => {
    if (!like) {
      return res
        .status(404)
        .json({ message: "Course not found with id of ${req.params.id}" });
    }
    res.status(200).json({ success: true, data: like });
  });
};




export const toggleMobLike = async (req, res, next) => {
  try {
    const { userId, listingId } = req.body; // Assuming you send userId and courseId in the request body

    let like = await Like.findOne({ userId, listingId });

    if (like) {
      // If like exists, remove it
      await Like.findByIdAndDelete(like._id);
      return res.status(200).json({ success: true, message: "Like removed", data: like });
    } else {
      // If like does not exist, create a new like
      like = await Like.createM({ userId, listingId });
      return res.status(201).json({ success: true, message: "Like added", data: like });
    }
  } catch (error) {
    next(error);
  }
};


