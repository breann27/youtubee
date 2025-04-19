// // models/Video.js
// const mongoose = require("mongoose");

// const VideoSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     category: { type: String },
//     videoUrl: { type: String, required: true },
//     thumbnail: { type: String, required: true },
//     views: { type: Number, default: 0 },
//     // Store user IDs of those who have viewed this video
//     uniqueViews: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "User",
//       default: [],
//     },
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
//     dislikes: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
//     ],
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Video", VideoSchema);


// models/Video.js
const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        "Music", "Education", "Gaming", "Tech", 
        "Cooking", "Sports", "Entertainment", "Other"
      ],
      default: "Other"
    },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    views: { type: Number, default: 0 },
    // Store user IDs of those who have viewed this video
    uniqueViews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);
