import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const formatViews = (views) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/video/${video._id}`}
      className="block w-full group hover:bg-gray-50 rounded-xl transition-all duration-200"
    >
      <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative aspect-video bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-3">
          <div className="flex-shrink-0">
            <img
              src={video.user?.profilePic || "/default-avatar.png"}
              className="w-9 h-9 rounded-full"
            />
          </div>

          <div className="flex flex-col flex-grow min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {video.title}
            </h3>

            <div className="text-xs text-gray-600 space-y-px">
              <div className="flex items-center gap-1">
                <span>{video.user?.channelName}</span>
                {video.user?.verified && (
                  <FaCheckCircle className="text-gray-500 text-[10px]" />
                )}
              </div>

              <div className="flex items-center text-gray-500">
                <span>{formatViews(video.views)}</span>
                <span className="mx-1">•</span>
                <span>{formatTimeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
