import axios from "axios";

// await axios.post("http://localhost:5000/send-prescription", {
await axios.post("https://ehr-fyp-1.onrender.com/send-prescription", {
  email: patientEmail,
  patientName: formData.patientName,
  doctorAddress: formData.doctorAddress,
  gender: formData.gender,
  diagnosis: formData.diagnosis,
  prescription: formData.prescription,
});
