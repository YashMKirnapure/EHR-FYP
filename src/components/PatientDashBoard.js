import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  const viewRecord = () => navigate(`/patient/${hhNumber}/viewrecords`);
  const grantPermission = () => navigate(`/patient/${hhNumber}/grantpermission`);
  const viewprofile = () => navigate(`/patient/${hhNumber}/viewprofile`);
  const uploadehr = () => navigate(`/patient/${hhNumber}/uploadehr`);

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

        try {
          const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
          setPatientDetails(result);
        } catch (err) {
          console.error("Error retrieving patient details:", err);
          setError("Error retrieving patient details");
        }
      } else {
        setError("Please install MetaMask extension");
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div className="bg-gradient-to-b from-[#0a2540] to-[#06172e] min-h-screen text-white font-sans">
      <NavBar_Logout />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center py-20 px-4"
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Patient Dashboard
        </motion.h2>

        {patientDetails && (
          <motion.p
            className="text-xl text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome{" "}
            <span className="font-semibold text-cyan-400">{patientDetails.name}</span>
          </motion.p>
        )}

        {error && (
          <p className="text-red-400 font-medium mb-6 text-center max-w-md">{error}</p>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: "View Profile", action: viewprofile },
            { label: "View Record", action: viewRecord },
            { label: "Upload Past Records", action: uploadehr },
            { label: "Grant Permission", action: grantPermission },
          ].map(({ label, action }, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={action}
              className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition duration-300"
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientDashBoard;
