import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import doctor from "../images/doctor.jpg";
import patient from "../images/patient.jpg";
import diagnostic from "../images/diagnostic.jpg";
const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-800 font-mono">
        <div className="flex flex-col items-center space-y-10 mt-[-50px] w-full max-w-4xl mx-auto">
          <div className="flex justify-center space-x-10 w-full">
            {/* Doctor */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={doctor}
                alt="Doctor"
                className="w-24 h-24 object-cover rounded-full"
              />
              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600"
                onClick={() => navigate("/doctor_registration")}
              >
                Doctor Registration
              </button>
            </div>

            {/* Patient */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={patient}
                alt="Patient"
                className="w-24 h-24 object-cover rounded-full"
              />
              <button
                className="bg-violet-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600"
                onClick={() => navigate("/patient_registration")}
              >
                Patient Registration
              </button>
            </div>

            {/* Diagnostic */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={diagnostic}
                alt="Diagnostic"
                className="w-24 h-24 object-cover rounded-full"
              />
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600"
                onClick={() => navigate("/diagnostic_registration")}
              >
                Diagnostics Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
