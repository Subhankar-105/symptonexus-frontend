import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";

import background from "../../../assets/apply_light.jpeg";
import dark_background from "../../../assets/doctor_light.webp";

import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaStethoscope,
  FaCalendarCheck,
  FaIdCard,
  FaChevronRight,
  FaBriefcaseMedical,
  FaCheckCircle,
} from "react-icons/fa";

import { MdEmail, MdPhone } from "react-icons/md";

import { GiMedicalPack } from "react-icons/gi";

import { FiChevronRight } from "react-icons/fi";

import { setProfile, logout } from "../../../../store/slices/authSlice";
import { deleteAccountApi } from "../../../services/accountDeleteApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DoctorProfile: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  const hydrated = useRef(false);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!profile && !hydrated.current) {
      const storedProfile = localStorage.getItem("doctorProfile");
      if (storedProfile) {
        dispatch(setProfile(JSON.parse(storedProfile)));
      }
      hydrated.current = true;
    }
  }, [profile, dispatch]);

  if (!user) return null;

  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  const fullName =
    `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to deactivate your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteAccountApi();

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Account deactivated successfully",
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();

        dispatch(logout());
        onClose();

        navigate("/login", { replace: true });
      } else {
        toast.error(response?.data?.message || "Failed to deactivate account");
      }
    } catch (error: unknown) {
      let message = "Something went wrong";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        if (typeof err.response?.data?.message === "string") {
          message = err.response.data.message;
        }
      }

      toast.error(message);
    }
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-1/2 right-[400px] -translate-y-1/2 translate-x-1/2 z-[9999]
        transition-transform duration-100
        ${
          open
            ? "translate-x-1/2 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 shadow-lg text-cyan-700 hover:text-red-500 transition"
        >
          <FiChevronRight size={20} style={{ strokeWidth: 3 }} />
        </button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-16 bottom-20 right-0 pb-10 w-[400px]
        shadow-2xl z-50 min-h-[calc(100vh-110px)]
        bg-cover flex flex-col justify-start
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto overflow-x-visible`}
        style={{
          backgroundImage: `url(${isDark ? dark_background : background})`,
        }}
      >
        <div className="bg-white/20 dark:bg-white/10 pb-5 rounded-4xl relative ml-7 mr-7 mt-20 border border-white/20">
          <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
            <div className="w-24 h-24 border-2 border-cyan-100 dark:border-gray-600 rounded-full bg-cyan-600 dark:bg-gray-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials || "D"
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-warp justify-end gap-2 text-[10px] text-black/70 pr-4">
            <span className="bg-cyan-200/50 dark:bg-gray-300/50 rounded-full flex items-center gap-1 py-1 px-1.5">
              <FaCalendarCheck /> {user.created_on}
            </span>
          </div>

          <h2 className="mt-4 pt-5 text-xl text-center font-bold text-gray-800 dark:text-gray-900">
            Dr. {fullName}
          </h2>

          <p className="text-gray-500 dark:text-gray-800 flex items-center justify-center gap-2">
            <MdEmail /> {user.email}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm p-1">
            <span className="px-4 py-2 bg-blue-50 dark:bg-gray-500/80 rounded-full flex items-center gap-2 shadow text-gray-700 dark:text-zinc-300">
              <FaStethoscope /> {user.specialization || "—"}
            </span>
          </div>

          <div className="ml-5 mr-5 mt-6 rounded-4xl">
            <div className="bg-cyan-50/40 dark:bg-gray-400/20 rounded-3xl p-5 grid grid-cols-1 gap-4 text-left border border-white/20">
              <div>
                <h3 className="text-blue-600 dark:text-gray-950 text-[17px] font-semibold flex items-center gap-2 pb-1">
                  <GiMedicalPack className="text-[20px]" /> Basic Details
                </h3>
                <div className="bg-white/30 dark:bg-gray-50/30 text-[14px] rounded-2xl p-2 px-3 gap-1.5 shadow">
                  <span className="text-gray-800 flex items-center gap-2">
                    <FaIdCard className="text-olive-600 dark:text-olive-700" />{" "}
                    {user.doctor_no}
                  </span>

                  <span className="text-gray-800 flex items-center gap-2">
                    <MdPhone className="text-green-600 dark:text-green-700" />{" "}
                    {user.phone_no || "—"}
                  </span>

                  <span className="text-gray-800 flex items-center gap-2">
                    <FaUserCircle className="text-indigo-600 dark:text-indigo-700" />{" "}
                    {user.gender || "—"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-blue-600 dark:text-gray-950 text-[17px] font-semibold flex items-center gap-2 pb-1">
                  <FaBriefcaseMedical className="text-[20px] pb-0.5 shrink-0" />{" "}
                  Experience Details
                </h3>
                <div className="bg-white/30 text-[14px] rounded-2xl p-2 px-3 gap-1.5 shadow">
                  <p className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500 dark:text-blue-700" />{" "}
                    {profile?.experience_years}+ years in total
                  </p>

                  <p className="flex items-baseline shrink-0 gap-1 pl-3">
                    <FaChevronRight className="pt-1 text-sky-500 dark:text-sky-700" />
                    Has experience as a {user.specialization} at Organization,
                    with {profile?.experience_years}+ years in practice.
                  </p>
                </div>
              </div>

              {/* Current Address */}
              <div className="mt-4">
                <div className="text-blue-600 dark:text-gray-950 text-[17px] font-semibold flex items-center gap-1 pb-2">
                  <FaMapMarkerAlt className="text-[19px] shrink-0" /> Address:
                </div>
                <div className="bg-white/30 text-[14px] rounded-2xl p-2 px-3 gap-1.5 shadow">
                  <p className="text-[14px]  whitespace-pre-line">
                    
                    {[
                      profile?.current_address?.address_line_1,
                      profile?.current_address?.address_line_2,
                      profile?.current_address?.city,
                      profile?.current_address?.district,
                      profile?.current_address?.state,
                      profile?.current_address?.country,
                    ]
                      .filter(Boolean)
                      .join("\n ")}

                    {profile?.current_address?.pin
                      ? `\n Pin - ${profile.current_address.pin}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="border w-60 border-gray-500/30 dark:border-gray-300/40 mt-2 items-center"></div>
              <div className="w-full flex justify-end pt-2">
                <button
                  onClick={handleDeleteAccount}
                  type="button"
                  className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-100 dark:bg-red-800 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-700 transition"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
