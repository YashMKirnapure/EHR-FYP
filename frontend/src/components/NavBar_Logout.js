import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/healthchain_logo 4.jpg";

const NavBar_Logout = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white h-[100px] flex items-center">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo with fixed height matching navbar */}
          <div className="flex items-center h-full">
            <img
              className="h-[80px] w-auto object-contain cursor-pointer" // Adjusted height to fit navbar
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Title - centered and responsive */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <span
              className="text-xl sm:text-2xl lg:text-3xl font-semibold cursor-pointer text-blue-500 whitespace-nowrap"
              onClick={() => navigate("/")}
            >
              HealthLink : A Blockchain EHR Solution
            </span>
          </div>

          {/* Navigation button - aligned right */}
          <div className="flex items-center">
            <button
              className="text-lg px-4 py-2 rounded-md font-medium transition-transform duration-300 ease-in-out transform hover:scale-110 text-red-500 hover:bg-red-500 hover:bg-opacity-10"
              onClick={() => navigate("/")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar_Logout;