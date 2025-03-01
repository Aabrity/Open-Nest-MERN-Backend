import Listing from '../model/listing_model.js';
import { errorHandler } from '../utils/error.js';
import Like from '../model/like_model.js';

export const createListing = async (req, res, next) => {
  try {
  const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, imageUrls, userRef } = req.body;

  
    if (!imageUrls || imageUrls.length === 0) {
      return next(errorHandler(400, 'At least one image is required.'));
    }

    // Create a new listing with the provided data
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls, 
      userRef,
    });

    // Return the newly created listing
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.isAdmin) {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  } 

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Count likes for the listing
    const likeCount = await Like.countDocuments({ listing: req.params.id });

    res.status(200).json({ ...listing.toObject(), likeCount });
  } catch (error) {
    next(error);
  }
};



export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const allListings = await Listing.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.listingId && { _id: req.query.listingId }),
    })

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // Add the like count for each listing
    const listingsWithLikes = await Promise.all(
      listings.map(async (listing) => {
        const likeCount = await Like.countDocuments({ listing: listing._id });
        return { ...listing.toObject(), likeCount };
      })
    );

   
   return res.status(200).json(listingsWithLikes);


  } catch (error) {
    next(error);
  }
};


export const getListingNumber = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const listings = await Listing.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.type && { category: req.query.type }),
     
      ...(req.query.listingId && { _id: req.query.listingId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalListings = await Listing.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthListings = await Listing.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      listings,
      totalListings,
      lastMonthListings,
    });
  } catch (error) {
    next(error);
  }
};




export const getMobListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};



export const getMobListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(401).json({ message: "cannot find the course with " });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};


export const getMobUserListing = async (req, res, next) => {
  try {
    const { id } = req.params; // user ID

    const listing = await Listing.find({ userRef: id });
    // const listing = await Listing.findById(req.params.userRef);

    if (!listing) {
      return res.status(401).json({ message: "cannot find the course with " });
    }

    res.status(200).json({  success: true,
      count: listing.length,
      data: listing, });
  } catch (err) {
    next(err);
  }
};

export const createMobListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};



export const updateMobListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Course not found with id of ${req.params.id}" });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};


export const deleteMobListing = async (req, res, next) => {
  // delete course by id
  await Listing.findByIdAndDelete(req.params.id).then((listing) => {
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Course not found with id of ${req.params.id}" });
    }
    res.status(200).json({ success: true, data: listing });
  });
};

