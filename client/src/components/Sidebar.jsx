import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaFire,
  FaClock,
  FaHistory,
  FaVideo,
  FaPlus,
  FaUserEdit,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed top-16 left-0 ${
        isOpen ? "w-64" : "w-16"
      } bg-white h-[calc(100vh-4rem)] p-4 transition-all duration-300 z-40`}
    >
      {/* Menu Items */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaHome size={20} />
          {isOpen && <span>Home</span>}
        </Link>

        <Link
          to="/trending"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaFire size={20} />
          {isOpen && <span>Trending</span>}
        </Link>
        <Link
          to="/subscriptions"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaVideo size={20} />
          {isOpen && <span>Subscriptions</span>}
        </Link>
        <Link
          to="/library"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaHistory size={20} />
          {isOpen && <span>Library</span>}
        </Link>
        <Link
          to="/watch-later"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaClock size={20} />
          {isOpen && <span>Watch Later</span>}
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
        >
          <FaUserEdit size={20} />
          {isOpen && <span>Edit Profile</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
