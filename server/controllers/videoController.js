// controllers/videoController.js
const Video = require("../models/Video");
const Comment = require("../models/Comment");
const cloudinary = require("../config/cloudinaryConfig");

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.files.video || !req.files.thumbnail) {
      // Check if both video file and thumbnail are provided
      return res
        .status(400)
        .json({ message: "Both video file and thumbnail are required" });
    }

    // Upload video file
    const videoResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.files.video[0].buffer);
    });

    // Upload thumbnail
    const thumbnailResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "thumbnails" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.files.thumbnail[0].buffer);
    });

    const newVideo = new Video({
      title,
      description,
      category,
      videoUrl: videoResult.secure_url,
      publicId: videoResult.public_id,
      thumbnail: thumbnailResult.secure_url, // Save thumbnail URL
      user: req.user._id,
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
 


exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).populate(
      "user",
      "channelName profilePic"
    );
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 

exports.incrementViews = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Ensure we have a logged-in user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user._id;
    
    // Check if user hasn't viewed before
    if (!video.uniqueViews.includes(userId)) {
      video.uniqueViews.push(userId);
      video.views += 1;
      await video.save();
    }

    res.status(200).json({ views: video.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: "Error incrementing views", error });
  }
};


exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id;

    if (video.likes.some(id => id.equals(userId))) {
      return res.status(200).json({
        likes: video.likes,  // Return full array
        dislikes: video.dislikes  // Return full array
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId }
      },
      { new: true }
    );

    res.status(200).json({
      likes: updatedVideo.likes,  // Return full array
      dislikes: updatedVideo.dislikes  // Return full array
    });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Error liking video", error });
  }
};

exports.dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id;

    if (video.dislikes.some(id => id.equals(userId))) {
      return res.status(200).json({
        likes: video.likes,  // Return full array
        dislikes: video.dislikes  // Return full array
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId }
      },
      { new: true }
    );

    res.status(200).json({
      likes: updatedVideo.likes,  // Return full array
      dislikes: updatedVideo.dislikes  // Return full array
    });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Error liking video", error });
  }
};

exports.searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    }).populate('user', 'channelName profilePic');

    res.status(200).json(videos);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getAllVideos = async (req, res) => {
  try {
    const { query, category } = req.query;
    const filter = {};

    // Handle search query
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }

    // Handle category filter
    if (category && category !== "All") {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const videos = await Video.find(filter)
      .populate('user', 'channelName profilePic verified')
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};