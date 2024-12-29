import express from 'express';
import { addComment, getComments, deleteComment } from '../controllers/comment_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/:id', verifyToken, addComment);


router.get('/:id', getComments);


router.delete('/:id', verifyToken, deleteComment);

export default router;
