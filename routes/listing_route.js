import express from 'express';
import { createListing, deleteListing, getListing, getListings, likeListing, unlikeListing, updateListing } from '../controllers/listing_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.post('/like/:id', verifyToken, likeListing);
router.post('/unlike/:id', verifyToken, unlikeListing);

export default router;