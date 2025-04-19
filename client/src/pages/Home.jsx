import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const categories = [
    "All",
    "Music",
    "Education",
    "Gaming",
    "Tech",
    "Cooking",
    "Sports",
    "Entertainment",
    "Other",
  ];
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = {
        query: searchQuery,
        category: selectedCategory,
      };

      const url = new URL("http://localhost:5000/api/videos");
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const res = await fetch(url);
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, selectedCategory]);

  // Remove the setSearchQuery("") from handleCategoryChange
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header onSearch={setSearchQuery} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="mt-16 p-4">
          {/* Category Filter */}
          <div className="fixed flex overflow-x-auto px-2 sm:px-4 space-x-4 sm:space-x-6 font-medium text-gray-600 text-sm sm:text-base">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-gray-500">
              Loading videos...
            </div>
          )}

          {/* Empty State */}
          {!loading && videos.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No videos found matching your criteria
            </div>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
