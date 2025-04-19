// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, commentController.addComment);
router.get('/:videoId', commentController.getCommentsByVideo);


  
module.exports = router;
