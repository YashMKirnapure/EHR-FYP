"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NavBar from "./NavBar"
import { useNavigate } from "react-router-dom";

// Importing images
import pic1 from "../images/HomePage_Pic1.jpg"
import pic2 from "../images/HomePage_Pic4.jpg"
import pic3 from "../images/HomePage_Pic5.jpg"
import pic4 from "../images/HomePage_Pic3.jpg"

// Import background image
import backgroundImage from "../images/background3.jpg"

function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [pic1, pic2, pic3, pic4]
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate();


  // Set up automatic image carousel
  useEffect(() => {
    if (!isHovering) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000) // Change image every 3 seconds

      return () => clearInterval(intervalId) // Clean up on unmount
    }
  }, [isHovering, images.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2 + 0.5,
      },
    }),
  }

  return (
    <div className="overflow-hidden">
      <NavBar />

      {/* Full background image container */}
      <div className="relative bg-gray-900 text-white font-sans min-h-screen">
        {/* Background with parallax effect */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
        >
          <img
            className="w-full h-full object-cover opacity-70"
            src={backgroundImage || "/background.jpg"}
            alt="Page background"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-gray-900/60 to-gray-900/90" />
        </motion.div>

        {/* Content positioned on top of the background */}
        <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Carousel */}
              <motion.div
                className="w-full lg:w-1/2 h-[400px] relative overflow-hidden rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                variants={itemVariants}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`Healthcare blockchain illustration ${currentImageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  />
                </AnimatePresence>

                {/* Image navigation dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full ${currentImageIndex === index ? "bg-cyan-400" : "bg-white/50"
                        }`}
                      onClick={() => setCurrentImageIndex(index)}
                      whileHover={{ scale: 1.5 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 mix-blend-overlay" />
              </motion.div>

              {/* Content */}
              <motion.div className="w-full lg:w-1/2 space-y-8" variants={itemVariants}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <motion.h1 className="text-4xl sm:text-5xl font-bold" variants={itemVariants}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                      Revolutionizing Healthcare
                    </span>
                    <br />
                    <span className="text-white">with Blockchain</span>
                  </motion.h1>

                  <motion.h2 className="mt-4 text-xl font-semibold text-cyan-300" variants={itemVariants}>
                    Secure. Transparent. Patient-Controlled.
                  </motion.h2>
                </motion.div>

                <motion.p className="text-lg text-gray-100 max-w-xl" variants={itemVariants}>
                  Our EHR App puts you in control of your health data with uncompromising security and seamless access
                  across the healthcare ecosystem.
                </motion.p>

                <motion.div className="grid sm:grid-cols-2 gap-4" variants={itemVariants}>
                  {[
                    "Immutable blockchain records",
                    "Decentralized storage with IPFS",
                    "Patient-controlled access",
                    "Real-time provider updates",
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50"
                      custom={i}
                      variants={featureVariants}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgba(14, 165, 233, 0.5)",
                      }}
                    >
                      <motion.div
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                      <span className="text-gray-100">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div className="flex flex-wrap gap-4 pt-4" variants={itemVariants}>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium shadow-lg shadow-blue-500/30"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/register")} // 👈 navigate to RegisterPage
                  >
                    Get Started
                  </motion.button>

                  <motion.button
                    className="px-6 py-3 border border-cyan-400/30 rounded-full text-cyan-300 font-medium backdrop-blur-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(8, 145, 178, 0.1)",
                      borderColor: "rgba(8, 145, 178, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/about")}
                  >
                    Learn More
                  </motion.button>

                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

