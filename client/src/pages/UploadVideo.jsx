import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!videoFile || !thumbnailFile) {
        setError("Please select both video and thumbnail files.");
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnailFile);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/videos/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Video upload failed");
        }
        const data = await response.json();
        toast.success("Video uploaded successfully!");
        navigate(`/video/${data._id}`);
      } catch (err) {
        setError(err.message);
      }
    };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
            placeholder="Video title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
            placeholder="Description"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2"
            placeholder="Category"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;

 