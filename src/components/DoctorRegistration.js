import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import doctor from "../images/doctor.jpg";

const DoctorRegistry = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
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
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
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

    if (!doctorAddress.trim()) newErrors.doctorAddress = "Wallet address is required";
    if (!doctorName.trim()) newErrors.doctorName = "Full name is required";
    if (!hospitalName.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!hospitalLocation.trim()) newErrors.hospitalLocation = "Hospital location is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
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
    if (!specialization) newErrors.specialization = "Specialization is required";
    if (!department) newErrors.department = "Department is required";
    if (!designation) newErrors.designation = "Designation is required";
    if (!workExperience) newErrors.workExperience = "Work experience is required";
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
        .isRegisteredDoctor(hhNumber)
        .call();

      if (isRegDoc) {
        alert("Doctor already exists");
        return;
      }

      await contract.methods
        .registerDoctor(
          doctorName,
          hospitalName,
          dateOfBirth,
          gender,
          email,
          hhNumber,
          specialization,
          department,
          designation,
          workExperience,
          password
        )
        .send({ from: doctorAddress });

      alert("Doctor registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the doctor.");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 flex items-start justify-center pt-32 px-6 pb-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl bg-slate-800 rounded-2xl shadow-xl p-8 border border-blue-600"
        >
          <img
            src={doctor}
            alt="Doctor"
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
          />

          <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
            Doctor Registration
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Wallet Public Address"
              name="doctorAddress"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              error={errors.doctorAddress}
            />

            <InputField
              label="Full Name"
              name="doctorName"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              error={errors.doctorName}
            />

            <InputField
              label="Hospital Name"
              name="hospitalName"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              error={errors.hospitalName}
            />

            <InputField
              label="Hospital Location"
              name="hospitalLocation"
              value={hospitalLocation}
              onChange={(e) => setHospitalLocation(e.target.value)}
              error={errors.hospitalLocation}
            />

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Date of Birth</label>
              <input
                type="date"
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
            </div>

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

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Oncology">Oncology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Other">Other</option>
              </select>
              {errors.specialization && <p className="text-red-400 text-sm mt-1">{errors.specialization}</p>}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Casualty">Casualty</option>
                <option value="Surgery">Surgery</option>
                <option value="Laboratory Services">Laboratory Services</option>
                <option value="Other">Other</option>
              </select>
              {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-blue-300">Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Designation</option>
                <option value="Doctor">Doctor</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Nurse">Nurse</option>
                <option value="Other">Other</option>
              </select>
              {errors.designation && <p className="text-red-400 text-sm mt-1">{errors.designation}</p>}
            </div>

            <InputField
              label="Work Experience (Years)"
              name="workExperience"
              type="number"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              error={errors.workExperience}
              min="0"
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

            <div className="col-span-full flex justify-center mt-8 gap-6">
              <motion.button
                type="button"
                onClick={handleRegister}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
              >
                Register
              </motion.button>
              <motion.button
                type="button"
                onClick={cancelOperation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
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
  <div className="mb-4">
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

export default DoctorRegistry;