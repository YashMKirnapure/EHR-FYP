import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import diagnostic from "../images/diagnostic.jpg";
const DiagnosticRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [diagnosticAddress, setDiagnosticAddress] = useState("");
  const [diagnosticName, setDiagnosticName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [diagnosticLocation, setDiagnosticLocation] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!diagnosticAddress.trim()) newErrors.diagnosticAddress = "Wallet address is required";
    if (!diagnosticName.trim()) newErrors.diagnosticName = "Diagnostic center name is required";
    if (!hospitalName.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!diagnosticLocation.trim()) newErrors.diagnosticLocation = "Location is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!hhNumber.trim()) {
      newErrors.hhNumber = "HH Number is required";
    } else if (!/^\d{6}$/.test(hhNumber)) {
      newErrors.hhNumber = "HH Number must be 6 digits";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const isRegDoc = await contract.methods
        .isRegisteredDiagnostic(hhNumber)
        .call();

      if (isRegDoc) {
        alert("Diagnostic already exists");
        return;
      }

      await contract.methods
        .registerDiagnostic(
          diagnosticName,
          hospitalName,
          diagnosticLocation,
          email,
          hhNumber,
          password
        )
        .send({ from: diagnosticAddress });

      alert("Diagnostic registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the diagnostic.");
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
          className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600"
        >
          <img
            src={diagnostic}
            alt="Diagnostic"
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
          />

          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
            Diagnostic Center Registration
          </h2>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Wallet Public Address"
              name="diagnosticAddress"
              value={diagnosticAddress}
              onChange={(e) => setDiagnosticAddress(e.target.value)}
              error={errors.diagnosticAddress}
            />

            <InputField
              label="Diagnostic Center Name"
              name="diagnosticName"
              value={diagnosticName}
              onChange={(e) => setDiagnosticName(e.target.value)}
              error={errors.diagnosticName}
            />

            <InputField
              label="Hospital Name"
              name="hospitalName"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              error={errors.hospitalName}
            />

            <InputField
              label="Location"
              name="diagnosticLocation"
              value={diagnosticLocation}
              onChange={(e) => setDiagnosticLocation(e.target.value)}
              error={errors.diagnosticLocation}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <InputField
              label="HH Number"
              name="hhNumber"
              value={hhNumber}
              onChange={(e) => sethhNumber(e.target.value)}
              error={errors.hhNumber}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <div className="col-span-full flex justify-center mt-6 gap-6">
              <motion.button
                type="button"
                onClick={handleRegister}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
              >
                Register
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

const InputField = ({ label, name, type = "text", value, onChange, error, min }) => (
  <div className="mb-2">
    <label className="text-sm font-medium text-blue-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export default DiagnosticRegistry;