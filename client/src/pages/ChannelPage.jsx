import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ChannelPage = () => {
  const { userId } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/channel/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch channel data");
        }
        const data = await response.json();
        setChannel(data.user);
        setVideos(data.videos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [userId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen p-4 md:p-6 lg:p-8">
      <div className="bg-yellow-400 text-black text-center p-3 font-bold text-lg">
        NEW VIDEOS EVERY <br /> FRIDAY, SATURDAY & SUNDAY
      </div>

      <div className="p-4 relative flex flex-col sm:flex-row items-center sm:items-start">
        <img
          src={channel.profilePic || "/default-avatar.png"}
          alt={channel.channelName}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto sm:mx-0"
        />
        <div className="ml-4 flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{channel.channelName}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-2 text-gray-600">
            <span>@{channel.username}</span>
            <span>·</span>
            <span>{videos.length} videos</span>
          </div>
          <div className="mt-2">
            <a
              href="https://youtube.com"
              target="_blank"
              className="text-blue-600 text-sm"
            >
              youtube.com/link
            </a>
          </div>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 mt-4 sm:mt-0">
          Subscribe
        </button>
      </div>

      <div className="flex overflow-x-auto border-b px-4 space-x-6 font-medium text-gray-600 whitespace-nowrap">
        {["Home", "Videos", "Shorts", "Live", "Playlists", "Posts", "Q"].map(
          (tab) => (
            <button
              key={tab}
              className="py-3 border-b-2 border-transparent hover:border-black"
            >
              {tab}
            </button>
          )
        )}
      </div>

      {videos.length === 0 ? (
        <p className="text-center p-4">No videos uploaded by this channel.</p>
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
                <h3 className="mt-2 font-bold text-lg uppercase tracking-wide">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm">{video.views} views</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
