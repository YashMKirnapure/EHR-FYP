import React, { useState, useEffect } from "react";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewDoctorProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDoctorDetails(hhNumber).call();
          setDoctorDetails(result);
        } else {
          setError("Please install MetaMask extension");
        }
      } catch (error) {
        console.error("Error retrieving doctor details:", error);
        setError("Error retrieving doctor details");
      }
    };

    fetchDoctorDetails();
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate("/doctor/" + hhNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 text-white">
      <NavBar_Logout />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-slate-800 border border-blue-600 rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-300">
            Doctor's Profile
          </h1>

          {doctorDetails && (
            <div className="space-y-4 text-lg text-blue-100">
              <p>
                <span className="font-semibold text-blue-400">Name:</span>{" "}
                {doctorDetails[1]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">DOB:</span>{" "}
                {doctorDetails[3]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Gender:</span>{" "}
                {doctorDetails[4]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Hospital:</span>{" "}
                {doctorDetails[2]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Specialization:</span>{" "}
                {doctorDetails[6]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Department:</span>{" "}
                {doctorDetails[7]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Designation:</span>{" "}
                {doctorDetails[8]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Experience:</span>{" "}
                {doctorDetails[9]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Email:</span>{" "}
                {doctorDetails[5]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">HH Number:</span>{" "}
                {hhNumber}
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={cancelOperation}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctorProfile;
