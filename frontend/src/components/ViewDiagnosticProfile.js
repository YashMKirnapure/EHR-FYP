import React, { useState, useEffect } from "react";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewDiagnosticProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosticDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDiagnosticDetails(hhNumber).call();
          setDiagnosticDetails(result);
        } else {
          setError("Please install MetaMask extension");
        }
      } catch (error) {
        console.error('Error retrieving diagnostic details:', error);
        setError('Error retrieving diagnostic details');
      }
    };

    fetchDiagnosticDetails();
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate("/diagnostic/" + hhNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 text-white">
      <NavBar_Logout />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-slate-800 border border-blue-600 rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-300">
            Diagnostic's Profile
          </h1>

          {diagnosticDetails && (
            <div className="space-y-4 text-lg text-blue-100">
              <p>
                <span className="font-semibold text-blue-400">Diagnostic Center Name:</span>{" "}
                {diagnosticDetails[1]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Hospital Name:</span>{" "}
                {diagnosticDetails[2]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Location:</span>{" "}
                {diagnosticDetails[3]}
              </p>
              <p>
                <span className="font-semibold text-blue-400">Email-ID:</span>{" "}
                {diagnosticDetails[4]}
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

export default ViewDiagnosticProfile;
