import axios from "axios";

await axios.post("http://localhost:5000/send-prescription", {
  email: patientEmail,
  patientName: formData.patientName,
  doctorAddress: formData.doctorAddress,
  gender: formData.gender,
  diagnosis: formData.diagnosis,
  prescription: formData.prescription,
});
