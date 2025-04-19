import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ProfileDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/profile/${userId}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }
        setUser(data.user);
        setVideos(data.videos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen p-4 md:p-6 lg:p-8">
      {/* Schedule Banner */}
      <div className="bg-yellow-400 text-black text-center p-3 font-bold text-lg sm:text-xl md:text-2xl">
        NEW VIDEOS EVERY <br className="sm:hidden" /> FRIDAY, SATURDAY & SUNDAY
      </div>

      {/* Profile Header */}
      <div className="p-4 relative flex flex-col sm:flex-row sm:items-start gap-4">
        <img
          src={user.profilePic || "https://via.placeholder.com/100"}
          alt={user.channelName}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg mx-auto sm:mx-0"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{user.channelName}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-2 text-gray-600 text-sm md:text-base">
            <span>@{user.username}</span>
            <span>·</span>
            <span>{videos.length} videos</span>
          </div>
          <div className="mt-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm md:text-base"
            >
              youtube.com/link
            </a>
          </div>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-red-700 mx-auto sm:mx-0">
          Subscribe
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b px-2 sm:px-4 space-x-4 sm:space-x-6 font-medium text-gray-600 text-sm sm:text-base">
        {["Home", "Videos", "Shorts", "Live", "Playlists", "Posts", "Q"].map(
          (tab) => (
            <button
              key={tab}
              className="py-3 whitespace-nowrap border-b-2 border-transparent hover:border-black"
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <p className="text-center mt-6 text-gray-600">
          No videos uploaded by this channel.
        </p>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div key={video._id} className="group">
              <Link to={`/video/${video._id}`} className="block">
                <img
                  src={video.thumbnail || "/thumbnail.png"}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                />
                <h3 className="mt-2 font-bold text-lg text-center sm:text-left">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm text-center sm:text-left">
                  {video.views} views
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
