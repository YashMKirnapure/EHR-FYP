import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import hospitalImage from "../images/hl.png";

const AboutUs = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-slate-900 text-white font-sans">
      <NavBar />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-80 overflow-hidden"
      >
        <img
          src={hospitalImage}
          alt="Hospital"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-blue-400 text-4xl md:text-6xl font-bold uppercase"
          >
            About Us
          </motion.h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-12 space-y-12"
      >
        {/* Who We Are */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-blue-600"
        >
          <h2 className="text-3xl font-extrabold text-center text-blue-400 mb-6 tracking-tight">
            Who We Are
          </h2>
          <p className="text-lg leading-relaxed text-gray-300">
            We are a passionate team of healthcare professionals and technology enthusiasts,
            working together to revolutionize Electronic Health Record (EHR) management. Our goal
            is to ensure secure, seamless, and efficient medical data storage and accessibility
            through advanced blockchain solutions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-blue-600 text-center"
          >
            <h3 className="text-2xl font-bold text-blue-400">For Doctors</h3>
            <p className="mt-4 text-gray-300">
              Doctors can efficiently access patient records, track medical history, and provide
              personalized treatment plans while ensuring secure data handling.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-blue-600 text-center"
          >
            <h3 className="text-2xl font-bold text-blue-400">For Patients</h3>
            <p className="mt-4 text-gray-300">
              Patients can access their complete health records, securely upload reports, and
              control who can view their medical information.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-blue-600 text-center"
          >
            <h3 className="text-2xl font-bold text-blue-400">For Diagnostic Centers</h3>
            <p className="mt-4 text-gray-300">
              Diagnostic centers can collaborate seamlessly by uploading reports directly to patient
              records, ensuring quick and secure access.
            </p>
          </motion.div>
        </motion.div>

        {/* Our Commitment */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-blue-600"
        >
          <h2 className="text-3xl font-extrabold text-center text-blue-400 mb-6 tracking-tight">
            Our Commitment
          </h2>
          <p className="text-lg leading-relaxed text-gray-300">
            We prioritize the security and integrity of medical records. With blockchain-based
            solutions, patients retain full control over their data, ensuring only authorized
            professionals have access. Our mission is to enhance trust and efficiency in
            healthcare management.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-10"
        >
          <h2 className="text-2xl font-bold text-blue-400">Get in Touch</h2>
          <p className="text-lg text-gray-300 mt-2">We'd love to hear from you!</p>
          <p className="text-gray-300">📞 Phone: 020 3445 5440 | 📧 Email: patientrelation@healthlink.com</p>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center pb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/")}
          >
            Back to Home Page
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;