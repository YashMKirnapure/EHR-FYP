import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import { create } from "ipfs-http-client";
import { motion } from "framer-motion";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import NavBar_Logout from "./NavBar_Logout";

const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

const PatientUploadEhr = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const [web3, setWeb3] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const patientContract = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork?.address
        );

        const result = await patientContract.methods.getPatientDetails(hhNumber).call();
        setPatientDetails(result);
      }
    };
    init();
  }, [hhNumber]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) return alert("Please select a file!");

      const report = await ipfs.add(file);
      const timestamp = new Date().toString();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UploadEhr.networks[networkId];
      const ehrContract = new web3.eth.Contract(
        UploadEhr.abi,
        deployedNetwork.address
      );

      await ehrContract.methods
        .addRecord(timestamp, report.path)
        .send({ from: patientDetails.walletAddress });

      setFile(null);
      fileInput.current.value = "";
      navigate("/patient/" + hhNumber);
    } catch (error) {
      console.error("EHR upload failed:", error);
    }
  };

  const handleCancel = () => navigate("/patient/" + hhNumber);

  return (
    <div className="bg-gradient-to-b from-[#0a2540] to-[#06172e] min-h-screen text-white">
      <NavBar_Logout />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-[#1e2d44] rounded-2xl shadow-xl p-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-cyan-400">
            Upload Past Medical Record
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-gray-300">Select File</label>
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInput}
                className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
              >
                Submit
              </motion.button>

              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientUploadEhr;
