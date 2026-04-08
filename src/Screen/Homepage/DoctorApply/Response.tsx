import React from "react";
import { useNavigate } from "react-router-dom";


const ApplicationSubmitted: React.FC = () => {
    const navigate = useNavigate();

      
    
  return (
    
            <div
      className="bg-gradient-to-r from-cyan-200 via-cyan-100 to-cyan-200 dark:from-gray-800 dark:via-cyan-800 dark:to-sky-900 flex items-center justify-center min-h-screen bg-cover bg-center"

    >


   
      <div className="bg-linear-to-r  from-cyan-50 to-cyan-300 dark:from-sky-900 dark:to-cyan-950 shadow-xl rounded-2xl p-10 max-w-fit w-fit text-center">

        {/* Title */}
        <h1 className="text-2xl font-bold text-cyan-800 dark:text-slate-300 mb-3">
          Your Application has been submitted
        </h1>

        {/* Subtitle */}
        <p className="text-cyan-700 dark:text-gray-300 mb-8">
          Thank you for applying. We’ve received your application and will
          review it shortly. You’ll be notified once there’s an update.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-800 dark:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-500 hover:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-cyan-600 transition hover:dark:bg-blue-700 "
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
    
  );
};

export default ApplicationSubmitted;