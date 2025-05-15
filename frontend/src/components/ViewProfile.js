import React, { useState, useEffect } from "react";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar_Logout from "./NavBar_Logout";

const ViewProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork?.address
        );
        setContract(contractInstance);

        const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
        setPatientDetails(result);
      } else {
        setError("Please install MetaMask extension");
      }
    };

    init();
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate("/patient/" + hhNumber);
  };

  return (
    <div className="bg-gradient-to-b from-[#0a2540] to-[#06172e] min-h-screen text-white">
      <NavBar_Logout />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-[#1e2d44] rounded-2xl shadow-lg p-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-cyan-400">
            Patient Profile
          </h1>

          {patientDetails ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 text-lg sm:text-xl"
            >
              {[
                { label: "Name", value: patientDetails.name },
                { label: "DOB", value: patientDetails.dateOfBirth },
                { label: "Gender", value: patientDetails.gender },
                { label: "Blood Group", value: patientDetails.bloodGroup },
                { label: "Address", value: patientDetails.homeAddress },
                { label: "Email", value: patientDetails.email },
              ].map((item, index) => (
                <p key={index}>
                  <span className="font-semibold text-gray-300">{item.label}:</span>{" "}
                  <span className="text-cyan-300">{item.value}</span>
                </p>
              ))}
            </motion.div>
          ) : error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : (
            <p className="text-gray-300 mt-4">Loading...</p>
          )}

          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelOperation}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition duration-300"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewProfile;
