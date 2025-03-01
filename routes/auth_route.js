import express from 'express';
import { google, login, signOut, signin, getUserProfile, signup, uploadImage,getMe, verifyEmail } from '../controllers/auth_controller.js';
import upload from '../utils/uploads.js';
import { protect } from '../utils/auth.js';


const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut);
router.post("/login", login);
router.post("/uploadImage", upload, uploadImage);
router.get('/profile', getUserProfile);
router.get("/getMe", protect, getMe);
router.get('/verify-email', verifyEmail); 

export default router;