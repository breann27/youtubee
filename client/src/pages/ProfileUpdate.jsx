import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProfileUpdate = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [channelName, setChannelName] = useState("");
  const [about, setAbout] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user information');
        }
        setUser(data);
        setUsername(data.username);
        setChannelName(data.channelName);
        setAbout(data.about);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("channelName", channelName);
    formData.append("about", about);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setUser(data);
      toast.success("Profile updated successfully!");
        } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
