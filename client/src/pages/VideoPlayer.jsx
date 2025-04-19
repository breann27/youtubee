import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState({
    likes: [],
    dislikes: [],
    user: {},
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/videos/${videoId}`
        );
        if (!response.ok) {
          throw new Error("Video not found");
        }
        const data = await response.json();
        setVideo(data);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/comments/${videoId}`
        );
        const commentsData = await res.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };
    fetchComments();
  }, [videoId]);

  // const handleLike = async () => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/videos/${videoId}/like`,
  //       {},
  //       {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );
  //     setVideo((prev) => ({
  //       ...prev,
  //       likes: response.data.likes,
  //       dislikes: response.data.dislikes,
  //     }));
  //   } catch (error) {
  //     console.error("Error liking video:", error);
  //   }
  // };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/like`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setVideo((prev) => ({
        ...prev,
        likes: response.data.likes, // Now receives the full array
        dislikes: response.data.dislikes, // Now receives the full array
      }));
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/dislike`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo((prev) => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  const handlePlay = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/videos/${videoId}/views`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Locally, you could update the view count if needed
      setVideo((prev) => ({ ...prev, views: prev.views + 1 }));
      // But the backend response now contains unique view logic.
    } catch (err) {
      console.error("Error incrementing views", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ videoId, text: newComment }),
      });
      if (!response.ok) throw new Error("Failed to post comment");
      const data = await response.json();
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-[75%] mx-auto max-w-3xl">
      <div className="w-full">
        <video
          controls
          src={video.videoUrl}
          // className="w-full h-auto"
          //  className="w-[75%] mx-auto h-auto rounded-lg"
          onPlay={handlePlay}
        />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="mt-2 text-gray-700">{video.description}</p>

        <div className="mt-2 flex justify-center md:justify-start space-x-4">
          <button onClick={handleLike} className="text-blue-500">
            👍 {video.likes.length}
          </button>
          <button onClick={handleDislike} className="text-red-500">
            👎 {video.dislikes.length}
          </button>
          <p className="text-gray-700">{video.views} views</p>
        </div>

        <div className="mt-5">
          <Link
            to={`/channel/${video.user._id}`}
            className="text-blue-500 hover:underline"
          >
            <div className="flex items-start">
              <img
                src={video.user.profilePic || "/default-avatar.png"}
                alt={video.user.channelName}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="ml-4 mt-4 flex-1">
                <h1 className="text-xl font-bold">{video.user.channelName}</h1>
                {/* <h1 className="text-xl font-bold">{video.user.about}</h1> */}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-5 ">
        <h2 className="text-xl font-semibold mb-4 text-center md:text-left">
          Comments
        </h2>

        <form onSubmit={handleComment} className="mb-4 flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-2 rounded-md resize-none"
            placeholder="Add a comment"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-3 border rounded-md bg-gray-100"
            >
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
