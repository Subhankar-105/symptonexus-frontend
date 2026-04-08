import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    if (location.pathname === path) {
      navigate("/"); // Toggle back to Home
    } else {
      navigate(path); // Navigate to clicked page
    }
  };

  return (

    <footer className="fixed bottom-0 left-0 w-full h-12 py-3 px-6 bg-linear-to-r from-cyan-700 via-cyan-600 to-sky-200 dark:from-slate-600 dark:via-sky-800 dark:to-sky-950 z-50">

      <div className="mx-w-7xl mx-auto px-6 flex items-center justify-between">
        <p className="text-gray-200 dark:text-gray-50 text-sm">
          © {new Date().getFullYear()} SymptoNexus. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm">
          <span 
            onClick={() => handleNavigate("/about")}
            className="text-gray-900 dark:text-gray-200 hover:text-gray-200 dark:hover:text-teal-500 cursor-pointer"
          >
            About
          </span>

          <span 
            onClick={() => handleNavigate("/privacy")}
            className="text-gray-900 dark:text-gray-200 hover:text-gray-200 dark:hover:text-teal-500 cursor-pointer"
          >
            Privacy Policy
          </span>

          <span 
            onClick={() => handleNavigate("/contact")}
            className="text-gray-900 dark:text-gray-200 hover:text-gray-500 dark:hover:text-teal-500 cursor-pointer"
          >
            Contact
          </span>

          <span 
            onClick={() => handleNavigate("/faq")}
            className="text-gray-900 dark:text-gray-200 hover:text-gray-500 dark:hover:text-teal-500 cursor-pointer"
          >
            FAQs
          </span>

          <span 
            onClick={() => handleNavigate("/apply_doctor")}
            className="text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-teal-500 cursor-pointer"
          >
            Join as Doctor
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
