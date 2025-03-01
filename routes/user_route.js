import express from 'express';
import { deleteUser, test, updateUser, getMe, getUserListings, getUser, uploadImage,updateMobUser, getUserMob} from '../controllers/user_controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../utils/uploads.js';
import { protect } from '../utils/auth.js';


const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
// router.get('/:id', protect, getUserMob)
router.post("/uploadImage", upload, uploadImage);
// router.get("/getMe", protect, getMe);
// router.put("/:id", protect, updateMobUser);


export default router;