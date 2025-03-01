import express from 'express';
import { createListing, createMobListing, deleteListing, deleteMobListing, getListing, getListingNumber, getListings, getMobListing, getMobListings, getMobUserListing, updateListing, updateMobListing } from '../controllers/listing_controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getLikesCount } from '../controllers/like_controller.js';
import { protect } from '../utils/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/gets', getListingNumber);
router.get('/get', getListings);
router.get('/likes/count/:id', getLikesCount);

//Mob
// router.get("/getAllListing", getMobListings);
// // router.get("get/:id", getMobListing);
// router.get("/getUser/:id", getMobUserListing);
// router.post("/createListing", createMobListing);
// router.put("/:id", protect, updateMobListing);
// router.delete("/:id", protect, deleteMobListing);
export default router;