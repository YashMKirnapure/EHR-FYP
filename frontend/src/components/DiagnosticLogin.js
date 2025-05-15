import React, { useState } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import diagnostic from "../images/diagnostic.jpg";
const DiagnosticLogin = () => {
  const navigate = useNavigate();
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!hhNumber.trim()) {
      newErrors.hhNumber = "HH Number is required";
    } else if (!/^\d{6}$/.test(hhNumber)) {
      newErrors.hhNumber = "HH Number must be 6 digits";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleCheckRegistration = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DiagnosticRegistration.networks[networkId];
      const contract = new web3.eth.Contract(
        DiagnosticRegistration.abi,
        deployedNetwork && deployedNetwork.address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredDiagnostic(hhNumber)
        .call();

      if (isRegisteredResult) {
        const isValidPassword = await contract.methods
          .validatePassword(hhNumber, password)
          .call();

        if (isValidPassword) {
          const diagnostic = await contract.methods
            .getDiagnosticDetails(hhNumber)
            .call();
          navigate("/diagnostic/" + hhNumber);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("Diagnostic center not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600"
        >
          <img
            src={diagnostic}
            alt="Diagnostic"
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
          />

          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
            Diagnostic Center Login
          </h2>

          <form className="space-y-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">HH Number</label>
              <input
                type="text"
                name="hhNumber"
                value={hhNumber}
                onChange={(e) => sethhNumber(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your HH Number"
              />
              {errors.hhNumber && <p className="text-red-400 text-sm mt-1">{errors.hhNumber}</p>}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <motion.button
                type="button"
                onClick={handleCheckRegistration}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                type="button"
                onClick={cancelOperation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
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

export default DiagnosticLogin;