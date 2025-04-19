// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import UploadVideo from "./pages/UploadVideo";
import ChannelPage from "./pages/ChannelPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/ProfileUpdate";
import ProfileDetails from "./pages/ProfileDetails";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/channel/:userId" element={<ChannelPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profileDetails/:userId" element={<ProfileDetails />} /> {/* ProfileDetails route */}
        {/* Optionally, add /profile route and others */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
