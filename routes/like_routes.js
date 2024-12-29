import express from 'express';
import { likeListing, unlikeListing, getLikesCount } from '../controllers/like_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/like/:id', verifyToken, likeListing);    // Like a listing
router.post('/unlike/:id', verifyToken, unlikeListing); // Unlike a listing
router.get('/likes/count/:id', getLikesCount);

export default router;
