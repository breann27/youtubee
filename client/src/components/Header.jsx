// src/components/Header.jsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaMicrophone,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaUpload,
  FaUser,
  FaUserEdit,
} from "react-icons/fa"; // Import the upload icon
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ onSearch, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const profilePic = localStorage.getItem("profilePic");
  const username = localStorage.getItem("username");
  const [query, setQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("username");

    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    navigate("/");
  };

  const handleInputChange = (value) => {
    setQuery(value);
    // Debounce search input
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => onSearch(value), 500));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="hover:bg-gray-100 p-2 rounded-full"
        >
          <FaBars size={24} />
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="/ytlogo.png"
            alt="YouTube Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center w-1/2 max-w-2xl">
        <form
          onSubmit={handleSearch}
          className="flex items-center flex-grow bg-gray-100 px-4 py-2 rounded-full border border-gray-300"
        >
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
          <button
            type="submit"
            className="ml-2 hover:bg-gray-200 p-2 rounded-full"
          >
            <FaSearch className="text-gray-600" />
          </button>
        </form>
        <button className="ml-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
          <FaMicrophone className="text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/upload"
          className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200"
        >
          {/* <FaVideo className="text-lg" /> */}
          <FaPlus className="text-lg" />
          <span className="font-medium">Create</span>
        </Link>

        <div className="relative">
          <FaBell className="text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            9+
          </span>
        </div>
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {token ? (
            <>
              {/* User Circle with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <FaUserEdit className="text-sm" />
                        Edit Profile
                      </Link>
                      <Link
                        to={`/profileDetails/${userId}`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <FaUser className="text-sm" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <FaSignOutAlt className="text-sm" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
