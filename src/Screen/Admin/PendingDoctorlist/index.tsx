import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEnvelope, FaUser, FaPhone, FaCheck, FaTimes } from "react-icons/fa";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
// import list_bg from "../../../assets/list_bg.png"
// import list_bg_dark from "../../../assets/list_bg_dark.png"

import {
  getPendingDoctorsApi,
  updateDoctorStatusApi
} from "../../../services/doctorApi";

import type { Doctor } from "../../../services/doctorApi";

const cardThemes = [
  "from-teal-50 to-cyan-200 dark:from-sky-900 dark:to-cyan-800",
  "from-cyan-50 to-cyan-200 dark:from-cyan-800 dark:to-cyan-700",
  "from-teal-50 to-cyan-200 dark:from-cyan-800 dark:to-sky-700",
  "from-sky-50 to-sky-200 dark:from-cyan-800 dark:to-sky-700",
  "from-cyan-50 to-teal-200 dark:from-cyan-800 dark:to-sky-700",
  "from-teal-50 to-cyan-200 dark:from-cyan-900 dark:to-sky-800",
];

const textColorThemes = [
  "text-cyan-950 dark:text-cyan-100",
  "text-cyan-950 dark:text-cyan-100",
  "text-cyan-950 dark:text-cyan-100",
  "text-teal-900 dark:text-teal-100",
  "text-sky-950 dark:text-sky-100",
  "text-teal-950 dark:text-teal-100",
];

const iconThemes = [
  "text-cyan-600 dark:text-cyan-100",
  "text-cyan-700 dark:text-cyan-100",
  "text-cyan-800 dark:text-cyan-100",
  "text-sky-600 dark:text-sky-100",
  "text-teal-700 dark:text-teal-100",
  "text-cyan-600 dark:text-cyan-100",
];

const PendingDoctorList: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const calledRef = useRef(false);

  const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canAccept = buttons?.some(
    (btn) => btn.control_key === "doctor accept"
  );

  const canDecline = buttons?.some(
    (btn) => btn.control_key === "doctor decline"
  );

  /* ================= FETCH ================= */

  useEffect(() => {

    if (calledRef.current) return;
    calledRef.current = true;

    const fetchDoctors = async () => {
      try {
        const data = await getPendingDoctorsApi();
        setDoctors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

  }, []);

  /* ================= ACCEPT ================= */

  const handleAccept = async (doctorId: number) => {

    try {

      const res = await updateDoctorStatusApi({
        doctor_id: doctorId,
        status: "Active"
      });

      if (res.data.success) {

        // remove from pending UI
        setDoctors(prev =>
          prev.filter(d => d.doctor_id !== doctorId)
        );

        // 🔥 IMPORTANT FIX
        dispatch(fetchDoctorListThunk());

      }

    } catch (error) {
      console.error(error);
    }

  };

  /* ================= DECLINE ================= */

  const handleDecline = async (doctorId: number) => {

    try {

      const res = await updateDoctorStatusApi({
        doctor_id: doctorId,
        status: "Rejected"
      });

      if (res.data.success) {

        setDoctors(prev =>
          prev.filter(d => d.doctor_id !== doctorId)
        );

      }

    } catch (error) {
      console.error(error);
    }

  };

  if (loading) {
    return <div className="p-6">Loading pending doctors...</div>;
  }
  return (

    <div className="bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 p-8 min-h-screen w-full">

      <h1 className="text-4xl font-bold mb-6 text-cyan-800 dark:text-cyan-50">
        Pending Doctor Approvals
      </h1>

      {doctors.length === 0 ? (

        <div>No pending doctors found.</div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-2">

          {doctors.map((doctor, index) => {

            const theme = cardThemes[index % cardThemes.length];
            const textColor = textColorThemes[index % textColorThemes.length];
            const iconColor = iconThemes[index % iconThemes.length];

            return (
              <div
                key={doctor.doctor_id}
                className={`bg-gradient-to-r ${theme} rounded-2xl shadow-md overflow-hidden relative
                           transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer transform `}
              >

                  {(canAccept || canDecline) && (

                  <div className="flex top-3 right-3 gap-2.5 z-10 absolute">

                    {canAccept && (
                      <button
                        onClick={() => handleAccept(doctor.doctor_id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full 
                                bg-white/40 backdrop-blur-md hover:text-green-700 dark:hover:text-green-800 text-green-600 dark:text-green-700
                                  shadow transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer transform"
                      >
                        <FaCheck />
                      </button>
                    )}

                    {canDecline && (
                      <button
                        onClick={() => handleDecline(doctor.doctor_id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full 
                                bg-white/40 backdrop-blur-md hover:text-red-700 dark:hover:text-red-800 text-red-600 dark:text-red-700
                                  shadow transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer transform"
                      >
                        <FaTimes />
                      </button>
                    )}

                  </div>

                )}
                {/* HEADER */}
                <div className="flex flex-col items-center text-center gap-2 pt-10 p-4">

                  {/* Avatar */}
                  <div className="w-18 h-18 flex items-center justify-center rounded-full text-xl bg-cyan-50 text-teal-600 font-bold 
                                  shadow transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer transform"
                  >
                    {doctor.first_name?.[0]}
                    {doctor.last_name?.[0]}
                  </div>

                  {/* Name + Tag */}
                  <div>
                    <h2 className={`font-semibold text-lg ${textColor}`}>
                      Dr. {doctor.first_name}
                      {doctor.middle_name ? ` ${doctor.middle_name}` : ""}{" "}
                      {doctor.last_name}
                    </h2>

                    <span className={`inline-block mt-1 text-[11px] px-3 py-0.5 rounded-full bg-white/70 dark:bg-black/30 ${textColor}`}>
                      {doctor.specialization}
                    </span>
                  </div>

                </div>

                {/* BODY */}
                <div className="bg-white/30 backdrop-blur-md rounded-xl mx-5 mb-4 pl-7 p-4 space-y-2 text-gray-700 dark:text-gray-50">

                  <div className="flex items-center gap-3">
                    <FaUser className={iconColor} />
                    <span className="text-gray-600 dark:text-gray-50">{doctor.gender}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaPhone className={iconColor} />
                    <span className="text-gray-600 dark:text-gray-50">{doctor.phone_no}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaEnvelope className={iconColor} />
                    <span className="text-gray-600 dark:text-gray-50">{doctor.email}</span>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>

  );

};

export default PendingDoctorList;