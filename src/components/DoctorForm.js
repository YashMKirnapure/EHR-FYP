import React, { useState, useEffect } from "react";
import DoctorForm from "../build/contracts/DoctorForm.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NavBar_Logout from "./NavBar_Logout";

const DoctorConsultancy = () => {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [web3Instance, setWeb3Instance] = useState(null);
  const [recId, setRecId] = useState("EHR" + uuidv4());
  const [formData, setFormData] = useState({
    patientName: "",
    doctorAddress: "",
    gender: "",
    diagnosis: "",
    prescription: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3Instance(web3Instance);
      } else {
        console.error("MetaMask not detected.");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let formValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} is required`;
        formValid = false;
      }
    });

    setErrors(newErrors);

    if (formValid) {
      try {
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = DoctorForm.networks[networkId];
        if (!deployedNetwork) throw new Error("Contract not found");

        const contract = new web3Instance.eth.Contract(DoctorForm.abi, deployedNetwork.address);

        await contract.methods
          .createEHR(
            recId,
            formData.patientName,
            formData.doctorAddress,
            formData.gender,
            formData.diagnosis,
            formData.prescription
          )
          .send({ from: formData.doctorAddress });

        const response = await fetch("http://localhost:5000/send-prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: formData.patientName,
            diagnosis: formData.diagnosis,
            medicines: formData.prescription,
            email: formData.email,
          }),
        });

        const result = await response.json();
        alert(result.message);

        setFormData({
          patientName: "",
          doctorAddress: "",
          gender: "",
          diagnosis: "",
          prescription: "",
          email: "",
        });
        setRecId("EHR" + uuidv4());
        navigate(-1);
      } catch (err) {
        console.error("Submission error:", err);
        alert("Error: Could not create EHR or send email.");
      }
    }
  };

  const cancelOperation = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-3xl bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
            Doctor Consultancy
          </h2>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="col-span-full">
              <label className="text-sm font-medium text-blue-300">Record ID:</label>
              <p className="text-white font-semibold mt-1">{recId}</p>
            </div>

            <InputField
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              error={errors.patientName}
            />

            <InputField
              label="Doctor Wallet Address"
              name="doctorAddress"
              value={formData.doctorAddress}
              onChange={handleInputChange}
              error={errors.doctorAddress}
            />

            <div className="mb-2">
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

            <InputField
              label="Patient Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />

            <TextArea
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              error={errors.diagnosis}
            />

            <TextArea
              label="Prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              error={errors.prescription}
            />

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

const TextArea = ({ label, name, value, onChange, error }) => (
  <div className="mb-2 col-span-full">
    <label className="text-sm font-medium text-blue-300">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export default DoctorConsultancy;
