import React, { useEffect, useState } from "react";
import Web3 from "web3";
import UploadEhr from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

function ViewPatientRecords() {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [records, setRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);

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

          const result = await patientContract.methods
            .getPatientDetails(hhNumber)
            .call();
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

  useEffect(() => {
    async function fetchRecords() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = UploadEhr.networks[networkId];
          const uploadEhrContract = new web3.eth.Contract(
            UploadEhr.abi,
            deployedNetwork.address
          );

          const fetchedRecords = await uploadEhrContract.methods
            .getRecords()
            .call({ from: patientDetails.walletAddress });

          setRecords(fetchedRecords);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Please install MetaMask extension.");
      }
    }

    if (patientDetails) {
      fetchRecords();
    }
  }, [patientDetails]);

  const cancelOperation = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 text-white">
      <NavBar_Logout />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-center mb-10 tracking-tight">
          Patient's Medical Records
        </h1>

        {records.length === 0 ? (
          <p className="text-center text-blue-200">No records found.</p>
        ) : (
          <ul className="space-y-6">
            {records.map((record, index) => (
              <li
                key={index}
                className="bg-slate-800 border border-blue-600 rounded-xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2">
                  <p className="text-blue-400 font-semibold">
                    Record #{index + 1}
                  </p>
                  <p className="text-blue-200">
                    Uploaded: {record.timeStamp}
                  </p>
                </div>
                <a
                  href={`http://localhost:8080/ipfs/${record.medicalRecordHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 shadow-md">
                    View Record
                  </button>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="text-center mt-10">
          <button
            onClick={cancelOperation}
            className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPatientRecords;
