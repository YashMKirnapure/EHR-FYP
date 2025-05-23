import React, { useState, useEffect, useRef } from "react";
import DiagnosticForm from "../build/contracts/DiagnosticForm.json";
import UploadEhr from "../build/contracts/UploadEhr.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { create } from "ipfs-http-client";
import NavBar_Logout from "./NavBar_Logout";

const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

const DiagnosticUpload = () => {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [web3Instance, setWeb3Instance] = useState(null);
  const [recId, setRecId] = useState("EHR" + uuidv4());
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    patientAddress: "",
    diagnosticAddress: "",
    age: "",
    gender: "",
    bg: "",
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      setWeb3Instance(web3);
    } else {
      console.error("MetaMask not detected.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} is required`;
        valid = false;
      }
    });

    if (!file) {
      newErrors.file = "File is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = DiagnosticForm.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not found");

      const report = await ipfs.add(file);
      const contract = new web3Instance.eth.Contract(DiagnosticForm.abi, deployedNetwork.address);
      await contract.methods
        .createEHR(
          recId,
          formData.doctorName,
          formData.patientName,
          parseInt(formData.age),
          formData.gender,
          formData.bg,
          formData.diagnosticAddress,
          formData.patientAddress,
          report.path
        )
        .send({ from: formData.diagnosticAddress });

      alert("EHR created successfully.");
      setRecId("EHR" + uuidv4());
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error: Could not create EHR.");
    }
  };

  const cancelOperation = () => navigate("/diagnostic/" + hhNumber);

  const uploadEhr = async (e) => {
    e.preventDefault();
    try {
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = UploadEhr.networks[networkId];
      if (!deployedNetwork) throw new Error("Upload contract not found");
      if (!file) return alert("No file uploaded");

      const report = await ipfs.add(file);
      const timestamp = Date().toString();

      const ehrContract = new web3Instance.eth.Contract(UploadEhr.abi, deployedNetwork.address);
      await ehrContract.methods.addRecord(timestamp, report.path).send({ from: formData.patientAddress });

      alert("EHR uploaded successfully.");
      fileInput.current.value = "";
      setFile(null);
      navigate("/diagnostic/" + hhNumber);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-3xl bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
            Diagnostic Report Upload
          </h2>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="col-span-full">
              <label className="text-sm font-medium text-blue-300">Record ID:</label>
              <p className="text-white font-semibold mt-1">{recId}</p>
            </div>

            <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={handleInputChange} error={errors.patientName} />
            <InputField label="Doctor Name" name="doctorName" value={formData.doctorName} onChange={handleInputChange} error={errors.doctorName} />
            <InputField label="Patient Address" name="patientAddress" value={formData.patientAddress} onChange={handleInputChange} error={errors.patientAddress} />
            <InputField label="Diagnostic Wallet Address" name="diagnosticAddress" value={formData.diagnosticAddress} onChange={handleInputChange} error={errors.diagnosticAddress} />
            <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} error={errors.age} />
            <InputField label="Blood Group" name="bg" value={formData.bg} onChange={handleInputChange} error={errors.bg} />

            <div>
              <label className="text-sm font-medium text-blue-300">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div className="col-span-full">
              <label className="text-sm font-medium text-blue-300">Upload Report</label>
              <input
                type="file"
                ref={fileInput}
                onChange={onFileChange}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.file && <p className="text-red-400 text-sm mt-1">{errors.file}</p>}
            </div>

            <div className="col-span-full flex justify-center mt-6 gap-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Create Record
              </button>
              <button
                type="button"
                onClick={cancelOperation}
                className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="mb-2">
    <label className="text-sm font-medium text-blue-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export default DiagnosticUpload;