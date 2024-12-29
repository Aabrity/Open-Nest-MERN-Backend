import express from 'express';
import { getAllUsers, getAllListings, deleteUserByAdmin } from '../controllers/admin_controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get all users
router.get('/users', verifyToken, getAllUsers);

// Get all listings
router.get('/listings', verifyToken, getAllListings);

// Delete a user
router.delete('/users/:id', verifyToken, deleteUserByAdmin);

export default router;
