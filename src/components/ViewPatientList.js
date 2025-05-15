import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate, useParams, Link } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

function ViewPatientList() {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const patientListContract = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const pList = await patientListContract.methods
            .getPatientList(hhNumber)
            .call();
          setPatientList(pList);

          const result = await patientListContract.methods
            .getDoctorDetails(hhNumber)
            .call();
          setDoctorDetails(result);
        } else {
          console.log("Please install MetaMask extension");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    init();
  }, [hhNumber]);

  const removePatient = async (patientNumber) => {
    try {
      if (!web3) throw new Error("Web3 not initialized");
      await window.ethereum.enable();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      if (!deployedNetwork) throw new Error("Contract not deployed to this network");

      const doctorContract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork.address
      );

      await doctorContract.methods
        .revokePermission(patientNumber, hhNumber)
        .send({ from: doctorDetails[0] });

      const updatedPatientList = await doctorContract.methods
        .getPatientList(hhNumber)
        .call();
      setPatientList(updatedPatientList);

      console.log("Patient removed successfully");
    } catch (error) {
      console.error("Error removing patient:", error);
    }
  };

  const cancelOperation = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-[#0a2540] to-[#06172e] min-h-screen text-white px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
          Patient List
        </h1>

        <div className="max-w-5xl mx-auto space-y-6">
          {patientList.map((patient, index) => (
            <div
              key={index}
              className="border border-blue-500 rounded-2xl p-6 flex flex-wrap justify-between items-center bg-white/5 backdrop-blur-md shadow-md"
            >
              <div className="text-lg font-medium">
                <p><span className="text-cyan-400">Patient {index + 1}</span></p>
                <p><span className="text-blue-300">Name:</span> {patient.patient_name}</p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <Link to={`/doctor/${patient.patient_number}/doctorviewpatient`}>
                  <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition">
                    View
                  </button>
                </Link>
                <button
                  onClick={() => removePatient(patient.patient_number)}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white shadow transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={cancelOperation}
            className="px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg rounded-xl transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPatientList;
