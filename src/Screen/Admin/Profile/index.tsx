import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../../store/store";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";
import background from "../../../assets/apply_light.jpeg";
import dark_background from "../../../assets/doctor_light.webp";
import {
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaHospital,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarCheck
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { logout } from "../../../../store/slices/authSlice";
import { deleteAccountApi } from "../../../services/accountDeleteApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AdminProfile: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile)
  const buttons = useSelector((state: RootState) => state.auth.buttons);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const canDeleteMyProfile = buttons?.some(
    (btn) => btn.control_key === "delete my acc"
  );

  const canEditProfile = buttons?.some(
    (btn) => btn.control_key === "edit profile"
  );

  if (!user) return null;

  const initials =
    `${user.first_name?.charAt(0)?.toUpperCase() || ""}${user.last_name
      ?.charAt(0)
      ?.toUpperCase() || ""}` || "A";

  const fullName =
    `${user.first_name || ""} ${user.middle_name || ""} ${user.last_name || ""}`.trim();

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
    const response = await deleteAccountApi()

    if (response?.data?.success) {
      toast.success(
        response?.data?.message || "Account deactivated successfully"
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

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
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

      <div
        className={`fixed top-16 bottom-16 right-0 w-[400px]
        shadow-2xl z-50 min-h-[calc(100vh-110px)] bg-cover flex flex-col justify-start
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        overflow-y-auto overflow-x-visible`}
        style={{
          backgroundImage: `url(${isDark ? dark_background : background})`,
        }}
      >
        <div className="bg-white/20 pb-5 rounded-4xl relative ml-7 mr-7 mb-8 mt-20 border border-white/20">
          <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
            <div className="w-24 h-24 border-2 border-cyan-100 dark:border-gray-600 rounded-full bg-cyan-600 dark:bg-gray-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {initials}
            </div>
          </div>

          {canEditProfile && (
            <button className="relative mt-5 ml-46 p-1 backdrop-blur-md bg-white/70 text-gray-500 dark:text-gray-700 hover:text-cyan-700 transition rounded-full">
              <PencilSquareIcon className="w-5 h-5 flex items-center pl-1" />
            </button>
          )}

          <h2
            className={`${
              user.role !== "super admin" ? "pt-10" : ""
            } mt-4 mb-2 text-xl font-bold text-center text-gray-800 dark:text-gray-900`}
          >
            {fullName}
          </h2>

          <p className="text-gray-700 dark:text-gray-800 flex justify-center items-center gap-2 mt-1">
            <FaEnvelope />
            {user.email}
          </p>

            {user.role === "standard admin" && (
                  <p className="flex items-center justify-center gap-2 pt-2 text-gray-700 dark:text-gray-800">
                    <FaHospital className="text-gray-700 dark:text-gray-800 " />
                    
                    {user?.department
  ? String(user.department)
      .split(",")
      .map((id) => Number(id.trim())) 
      .map(
        (id) =>
          DOCTOR_SPECIALIZATIONS.find((spec) => spec.value === id)
            ?.department
      )
      .filter((dept): dept is string => Boolean(dept)) 
      .join(", ")
  : "-"}
                  </p>
                )}


          <div className="mt-4 flex justify-center">
            <span className="px-4 py-2 bg-cyan-600 dark:bg-gray-500 rounded-full shadow flex items-center gap-2 text-gray-200 dark:text-gray-200">
              <FaUserShield />
              {user.role || "Admin"}
            </span>
          </div>

          <div className="ml-5 mr-5 mt-6 rounded-4xl">
            <div className="p-6 text-center rounded-4xl bg-white/40 dark:bg-gray-500/40">
              <div
                className={`${
                  user.role !== "super admin" ? "" : "pt-5"
                } space-y-3 text-sm text-gray-700 dark:text-gray-200`}
              >

                <p className="flex items-center  gap-2">
                  <FaVenusMars className="text-rose-500" />
                  <span className="font-medium dark:text-gray-100">Gender:</span>
                  {user.gender || "—"}
                </p>

                <p className="flex items-center gap-2">
                  <FaBirthdayCake className="text-yellow-500" />
                  <span className="font-medium dark:text-gray-100">Date Of Birth:</span>
                  {user.dob || "—"}
                </p>

                <p className="flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  <span className="font-medium dark:text-gray-100">Phone no:</span>
                  {user.phone_no}
                </p>

                <p className="flex items-center gap-2">
                  <FaCalendarCheck className="text-purple-500" />
                  <span className="font-medium dark:text-gray-100">Joined on:</span>
                  {user.created_on || "—"}
                </p>
<div className="space-y-3 text-left">
  <div className="flex items-start gap-2">
    <FaMapMarkerAlt className="text-blue-500 text-3xl pb-2" />

    <p className="text-sm text-gray-700 dark:text-gray-100/80">
      <span className="font-medium text-gray-800 dark:text-gray-100">
        Address:{" "}
      </span>

      {[
        profile?.current_address?.address_line_1,
        profile?.current_address?.address_line_2,
        profile?.current_address?.city,
        profile?.current_address?.district,
        profile?.current_address?.state,
        profile?.current_address?.country,
      ]
        .filter(Boolean)
        .join(", ")}

      {profile?.current_address?.pin
        ? `, Pin - ${profile.current_address.pin}`
        : ""}
    </p>
  </div>
</div>
                {user?.role !== "super admin" && (
                  <div className="absolute border w-58 border-gray-400/30 mt-2 ml-1 items-center"></div>
                )}

                <div className="w-full flex justify-end pt-5">
                  {canDeleteMyProfile && (
                    <button
                      onClick={handleDeleteAccount}
                      type="button"
                      className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                    >
                      Deactivate Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default AdminProfile;