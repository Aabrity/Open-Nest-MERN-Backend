import express from 'express';
import { addComment, getComments,getallcomments, deleteComment, createMobComment, updateMobComment, deleteMobComment, getMobComments, getMobComment } from '../controllers/comment_controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { protect } from '../utils/auth.js';

const router = express.Router();


router.post('/add/:id', verifyToken, addComment);
router.get('/get/:id', getComments);
router.delete('/delete/:id', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getallcomments);

//Mob
router.get("/getAllComment", getMobComments);
router.get("/get/:id", getMobComment);
// router.get("/:id", getMobComment);
router.post("/createComment", createMobComment);
router.put("/:id", protect, updateMobComment);
router.delete("/:id", protect, deleteMobComment);

export default router;
