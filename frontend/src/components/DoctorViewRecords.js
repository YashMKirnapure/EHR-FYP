import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorViewPatient = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorForm = () => navigate(`/doctor/${hhNumber}/doctorform`);
  const viewPatientRecords = () => navigate(`/patient/${hhNumber}/viewrecords`);
  const cancelOperation = () => navigate(-1);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];

          if (deployedNetwork?.address) {
            const contractInstance = new web3Instance.eth.Contract(
              PatientRegistration.abi,
              deployedNetwork.address
            );
            setContract(contractInstance);
            const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
            setPatientDetails(result);
          } else {
            setError("Contract not found on this network.");
          }
        } else {
          setError("Please install MetaMask.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching patient data.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 font-sans">
      <NavBar_Logout />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <h2 className="text-3xl font-extrabold text-white text-center mb-10 tracking-tight">
          Patient's Profile
        </h2>

        {loading && <p className="text-center text-blue-300">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {patientDetails && (
          <div className="bg-slate-800 border border-blue-600 rounded-2xl shadow-xl p-8 space-y-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailField label="Name" value={patientDetails.name} />
              <DetailField label="DOB" value={patientDetails.dateOfBirth} />
              <DetailField label="Gender" value={patientDetails.gender} />
              <DetailField label="Blood Group" value={patientDetails.bloodGroup} />
              <DetailField label="Address" value={patientDetails.homeAddress} colSpan />
              <DetailField label="Email" value={patientDetails.email} colSpan />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          <ActionButton text="View Record" onClick={viewPatientRecords} />
          <ActionButton text="Prescription Consultancy" onClick={doctorForm} />
          <ActionButton
            text="Close"
            onClick={cancelOperation}
            customStyle="bg-slate-600 hover:bg-slate-700 text-white"
          />
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value, colSpan = false }) => (
  <div className={colSpan ? "md:col-span-2" : ""}>
    <p className="text-blue-300 font-medium">{label}</p>
    <p className="text-white text-lg font-semibold mt-1">{value}</p>
  </div>
);

const ActionButton = ({ text, onClick, customStyle }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105 w-full sm:w-1/3 ${
      customStyle || "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
  >
    {text}
  </button>
);

export default DoctorViewPatient;
