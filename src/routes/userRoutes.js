import express from 'express';
import { getUsers, uploadAvatar, updateProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getUsers);
router.put('/profile', verifyToken, updateProfile);
router.post('/avatar', verifyToken, upload.single('file'), uploadAvatar);
export default router;