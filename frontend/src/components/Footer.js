import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-950 to-slate-900 text-white py-10 px-4 font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-blue-300 mb-3">Contact</h3>
          <p><span className="font-semibold">Address:</span> Near Wadia College of Engineering, Pune</p>
          <p><span className="font-semibold">Phone:</span> 020 3445 5440</p>
          <p><span className="font-semibold">Email:</span> patientrelation@healthlink.com</p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold text-blue-300 mb-3">Useful Links</h3>
          <ul className="space-y-2">
            {["About Us", "Services", "FAQs", "Privacy Policy"].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-blue-400 transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Links */}
        <div>
          <h3 className="text-xl font-semibold text-blue-300 mb-3">Other Links</h3>
          <ul className="space-y-2">
            {["Security Partners", "Medical Donors", "Sponsors", "Careers", "Board Members Information"].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-blue-400 transition">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center md:justify-end space-x-5 mt-4 md:mt-0">
          <a
            href="https://instagram.com/company"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
            href="https://facebook.com/company"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faFacebookF} size="2x" />
          </a>
          <a
            href="https://linkedin.com/company"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
          </a>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-10">
        &copy; 2025 HealthLink. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
