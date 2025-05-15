import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";

const DoctorDashBoardPage = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const viewPatientList = () => {
    navigate(`/doctor/${hhNumber}/patientlist`);
  };

  const viewDoctorProfile = () => {
    navigate(`/doctor/${hhNumber}/viewdoctorprofile`);
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          const result = await contractInstance.methods.getDoctorDetails(hhNumber).call();
          setDoctorDetails(result);
        } catch (error) {
          console.error("Error initializing Web3 or fetching doctor details:", error);
          setError("⚠️ Unable to fetch doctor details. Please try again.");
        }
      } else {
        console.error("Please install MetaMask extension");
        setError("⚠️ MetaMask not detected. Please install the extension.");
      }
      setLoading(false);
    };

    init();
  }, [hhNumber]);

  return (
    <div className="bg-gradient-to-b from-[#0a2540] to-[#06172e] min-h-screen">
      <NavBar_Logout />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center text-white font-sans py-16 px-4 sm:px-6 md:px-12 lg:px-20"
      >
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-4 text-center">
          Doctor Dashboard
        </h2>

        {loading && <p className="text-lg text-gray-300 mb-4">Loading your profile...</p>}

        {!loading && doctorDetails && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl mb-8 text-center"
          >
            Welcome,{" "}
            <span className="font-semibold text-cyan-400">{doctorDetails[1]}</span>
          </motion.p>
        )}

        {!loading && error && (
          <p className="text-red-400 font-medium mb-6 text-center max-w-md">{error}</p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 sm:gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={viewDoctorProfile}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm sm:text-base"
          >
            View Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={viewPatientList}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg text-sm sm:text-base"
          >
            View Patient List
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorDashBoardPage;
