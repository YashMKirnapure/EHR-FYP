import React, { useState, useEffect } from "react";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NavBar_Logout from "./NavBar_Logout";
import { motion } from "framer-motion";

const PatientGrantPermission = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorNumber, setDoctorNumber] = useState("");
  const [doctorNumberError, setDoctorNumberError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];
          const patientContract = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await patientContract.methods.getPatientDetails(hhNumber).call();
          setPatientDetails(result);
        } else {
          console.log("Please install MetaMask extension");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    init();
  }, [hhNumber]);

  const handleGiveAccess = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not deployed");

      const doctorContract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork.address
      );

      const isRegistered = await doctorContract.methods.isRegisteredDoctor(doctorNumber).call();
      if (isRegistered) {
        const isPermissionGranted = await doctorContract.methods
          .isPermissionGranted(hhNumber, doctorNumber)
          .call();

        if (!isPermissionGranted) {
          await doctorContract.methods
            .grantPermission(hhNumber, doctorNumber, patientDetails.name)
            .send({ from: patientDetails.walletAddress });
          alert("Access granted successfully.");
        } else {
          alert("Access is already given!");
          return;
        }
      } else {
        alert("Doctor does not exist!");
        return;
      }

      navigate("/patient/" + hhNumber);
    } catch (error) {
      console.error("Permission granting failed:", error);
    }
  };

  const handleRemoveAccess = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not deployed");

      const doctorContract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork.address
      );

      const isRegistered = await doctorContract.methods.isRegisteredDoctor(doctorNumber).call();
      if (isRegistered) {
        const isPermissionGranted = await doctorContract.methods
          .isPermissionGranted(hhNumber, doctorNumber)
          .call();

        if (isPermissionGranted) {
          await doctorContract.methods
            .revokePermission(hhNumber, doctorNumber)
            .send({ from: patientDetails.walletAddress });
          alert("Access removed successfully.");
        } else {
          alert("Access was not granted to this doctor.");
          return;
        }
      } else {
        alert("Doctor does not exist!");
        return;
      }

      navigate("/patient/" + hhNumber);
    } catch (error) {
      console.error("Removing permission failed:", error);
    }
  };

  const handlehhNumberChange = (e) => {
    const input = e.target.value;
    const valid = /^\d{6}$/.test(input);
    setDoctorNumber(input);
    setDoctorNumberError(valid ? "" : "Please enter a 6-digit HH Number.");
  };

  const cancelOperation = () => {
    navigate("/patient/" + hhNumber);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-start justify-center pt-16 p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600 mt-8"
        >
          {patientDetails && (
            <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
              Grant Access to Doctor
            </h2>
          )}

          <div className="mb-6">
            <label className="text-sm font-medium text-blue-300">
              Doctor HH Number
            </label>
            <input
              type="text"
              value={doctorNumber}
              onChange={handlehhNumberChange}
              placeholder="Enter 6-digit HH Number"
              className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {doctorNumberError && (
              <p className="text-red-400 text-sm mt-1">{doctorNumberError}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <motion.button
              onClick={handleGiveAccess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
            >
              Give Access
            </motion.button>
            <motion.button
              onClick={handleRemoveAccess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
            >
              Remove Access
            </motion.button>
            <motion.button
              onClick={cancelOperation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientGrantPermission;