import express from 'express';
import { likeListing, getLikesCount, getMobLikes, getMobLike, createMobLike,  deleteMobLike } from '../controllers/like_controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { protect } from '../utils/auth.js';

const router = express.Router();

router.post('/like/:id', verifyToken, likeListing);   
router.get('/likes/count/:id', getLikesCount);
router.get("/getAllLikeMob", getMobLikes);
router.get("/get/:id", getMobLike);
router.post("/createLikeMob", createMobLike);
router.delete("/Mob/:id", protect, deleteMobLike);


export default router;
