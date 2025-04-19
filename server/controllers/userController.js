// controllers/userController.js
const User = require('../models/User');
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinaryConfig');

// Existing updateProfile method remains here...
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { channelName, about } = req.body;
    let profilePicUrl;

    if (req.file) {
      // Upload new profile picture to Cloudinary
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "profile_pics" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await streamUpload();
      profilePicUrl = result.secure_url;
    }

    const updatedData = {};
    if (channelName) updatedData.channelName = channelName;
    if (about) updatedData.about = about;
    if (profilePicUrl) updatedData.profilePic = profilePicUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getChannel = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user details (excluding sensitive data, such as password)
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Find all videos uploaded by the user
    const videos = await Video.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ user, videos });
  } catch (error) {
    console.error("Get channel error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { username, channelName, about } = req.body;
    let profilePicUrl;

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'profile_pics' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await streamUpload();
      profilePicUrl = result.secure_url;
    }

    const updatedData = {};
    if (username) updatedData.username = username;
    if (channelName) updatedData.channelName = channelName;
    if (about) updatedData.about = about;
    if (profilePicUrl) updatedData.profilePic = profilePicUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const videos = await Video.find({ user: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({ user, videos });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};