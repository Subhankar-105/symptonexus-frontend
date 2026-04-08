import React from "react";
import { teamMembers } from "../../../Environment";
import { FaUsers } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center px-6 py-10 bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100 dark:from-sky-950 dark:via-sky-900 dark:to-sky-950">
      
      {/* About Section */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-sky-900 text-center p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-3 bg-linear-to-r from-cyan-800 to-cyan-600 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">
          About Us
        </h1>
        <p className="text-slate-600 dark:text-gray-300 text-justify">
          SymptoNexus is a healthcare support platform developed to assist users in understanding their symptoms, exploring safe home remedies, and connecting with healthcare professionals. The platform aims to reduce uncertainty in health-related situations and improve accessibility to medical guidance. By combining intuitive design with ethical and user-friendly technology, SymptoNexus provides a reliable and approachable digital healthcare support system.

        </p>
        <p className="text-slate-600 dark:text-gray-300 mt-2">
          We focus on guidance and comfort, not replacing professional medical advice.
        </p>
      </div>

      {/* Team Section */}
      <h2 className="text-3xl font-semibold mt-10 mb-6 text-cyan-800 dark:text-gray-300 text-center flex items-center gap-2">
        <FaUsers/> Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {teamMembers.map((member) => (
          
          <div
            key={member.name}
            className="bg-gradient-to-r from-cyan-200 to-cyan-50 dark:from-cyan-900 dark:via-sky-900 dark:to-cyan-900 rounded-xl shadow-lg overflow-hidden
                 transition-all duration-300 ease-in-out
                 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
          >
            <div className="flex justify-center pt-6">
              <img
                src={member.img}
                alt={member.name}
                className="w-40 h-40 object-cover rounded-full shadow-md"
              />
            </div>

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-cyan-900 dark:text-gray-300">{member.name}</h3>
              <p className="text-neutral-700 dark:text-zinc-300">{member.role}</p>
              <p className="text-slate-500 dark:text-gray-300 mt-2 text-justify">{member.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
