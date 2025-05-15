import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/healthchain_logo 4.jpg";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white h-[120px] fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-0">
          {/* Logo */}
          <div className="shrink-0">
            <img
              className="h-24 w-48 my-[10px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Title */}
          <div className="mt-4 sm:mt-0 sm:ml-10 text-center text-blue-500">
            <span
              className="text-2xl sm:text-2xl lg:text-2xl font-semibold cursor-pointer"
              onClick={() => navigate("/")}
            >
              HealthLink : A Blockchain EHR Solution
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0">
            <button
              className="text-lg px-4 py-2 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              className="text-lg px-4 py-2 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/AboutPage")}
            >
              About Us
            </button>
            <button
              className="text-lg px-4 py-2 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="text-lg px-4 py-2 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
