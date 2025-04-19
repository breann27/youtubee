// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getChannel, updateUserInfo, getUserInfo, getUserProfileById } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

// Update profile endpoint (protected)
router.get('/profile', protect, getUserInfo);
router.put('/profile', protect, upload.single('profilePic'), updateUserInfo);
router.get('/profile/:userId', getUserProfileById);

// Get channel information and videos by user ID (public)
router.get('/channel/:userId', getChannel);

module.exports = router;
