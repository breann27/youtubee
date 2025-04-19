// controllers/commentController.js
const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const newComment = new Comment({
      video: videoId,
      user: req.user._id, // ensure the protect middleware is used
      text,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username channelName profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
