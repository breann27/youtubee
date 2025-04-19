// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

// POST /api/videos/upload (protected route)
router.post('/upload', protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.uploadVideo);router.get('/:videoId', videoController.getVideoById);
router.get('/search', videoController.searchVideos);
router.patch('/:videoId/views', protect, videoController.incrementViews);
router.post('/:videoId/like', protect, videoController.likeVideo);
router.post('/:videoId/dislike', protect, videoController.dislikeVideo);

// GET /api/videos/ (public route)
router.get('/', videoController.getAllVideos);

module.exports = router;
