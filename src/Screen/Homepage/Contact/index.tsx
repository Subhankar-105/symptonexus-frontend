import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import  { teamMembers } from "../../../Environment";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100 dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 px-4 py-10">
      {/* ================= HEADER ================= */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-800 to-cyan-400 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400 mb-3">
          Contact Us
        </h1>
        <p className="text-cyan-800 dark:text-gray-300">
          We’re here to help. Reach out to us with any questions or concerns.
        </p>
      </div>

      {/* ================= CONTACT INFO ================= */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-200 dark:from-cyan-800 dark:to-sky-800 p-6 rounded-xl shadow text-center">
          <FaEnvelope className="text-cyan-500 dark:text-slate-400 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-slate-300 font-semibold text-lg mb-1">Email</h3>
          <p className="text-gray-600 dark:text-slate-300">
            symptonexus333@gmail.com
          </p>
        </div>

        <div className="bg-linear-to-r from-cyan-50 to-cyan-200 dark:from-cyan-800 dark:to-sky-800 p-6 rounded-xl shadow text-center">
          <FaPhoneAlt className="text-cyan-500 dark:text-slate-400 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-slate-300 font-semibold text-lg mb-1">Phone</h3>
          <p className="text-gray-600 dark:text-slate-300">
            +91 98765 43210
          </p>
        </div>

        <div className="bg-linear-to-r from-cyan-50 to-cyan-200 dark:from-cyan-800 dark:to-sky-800 p-6 rounded-xl shadow text-center">
          <FaMapMarkerAlt className="text-cyan-500 dark:text-slate-400 text-3xl mx-auto mb-3" />
          <h3 className="text-gray-600 dark:text-slate-300 font-semibold text-lg mb-1">Location</h3>
          <p className="text-gray-600 dark:text-slate-300">
            India
          </p>
        </div>
      </div>

      {/* ================= OUR TEAM ================= */}
<div className="max-w-4xl mx-auto mb-12">
  <h2 className="text-3xl font-bold text-center bg-linear-to-r from-cyan-800 to-cyan-400 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400 mb-6">
    Our Team
  </h2>

  <div className="grid md:grid-cols-4 gap-6">
    {teamMembers.map((member) => (
      <div
        key={member.name}
        className="bg-linear-to-r from-cyan-100 to-cyan-50 dark:from-cyan-800 dark:to-sky-800 p-6 rounded-xl shadow text-center rounded-xl shadow-lg overflow-hidden
                 transition-all duration-300 ease-in-out
                 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {member.name}
        </h3>

        <p className="text-sm text-cyan-800 dark:text-slate-300 mb-3">
          {member.role}
        </p>

        <p className="text-gray-600 dark:text-slate-300 text-center flex items-center gap-2">
          <FaPhoneAlt/> {member.num}
        </p>

        <p className="text-gray-600 dark:text-slate-300 text-xs text-center flex items-center gap-2">
        <FaEnvelope className="flex-shrink-0" />
  <span className="truncate">{member.email}</span>
        </p>
      </div>
    ))}
  </div>
</div>
      {/* ================= CONTACT FORM ================= */}
      <div className="max-w-3xl mx-auto bg-linear-to-r from-cyan-100 via-cyan-50 to-cyan-100 dark:from-sky-800 dark:via-cyan-800 dark:to-sky-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-cyan-700 dark:text-slate-300 mb-6 text-center">
          Send Us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1  text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-400 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Your name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-400 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-md border dark:text-gray-200 dark:border-gray-400 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Write your message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-cyan-400 to-cyan-600 dark:from-cyan-900 dark:to-sky-950 text-white py-2 rounded-md font-semibold hover:from-sky-600 hover:to-cyan-900 dark:hover:from-sky-700 dark:hover:to-cyan-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* ================= FOOTER NOTE ================= */}
      <p className="text-center text-gray-500 dark:text-gray-300 mt-8 text-sm">
        We usually respond within 24 hours.
      </p>
    </div>
  );
};

export default Contact;
