import React, { useEffect } from "react";
import {
  FaPhoneAlt,
  // FaUser,
  // FaBirthdayCake,
  // FaBriefcase,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";

const AdminProfileView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const navigate = useNavigate();

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );
  

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const admin = admins.find(
    (a) => a.admin_user_id === Number(id)
  );

  const getInitials = () => {
    if (!admin) return "";
    return `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!admin) return <p className="text-center mt-10">Admin Not Found</p>;

return (
  <div className="min-h-screen">
    <div className="max-w-full mx-auto space-y-6 bg-sky-200/30 dark:bg-slate-900 p-5 rounded-2xl shadow">

      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-500 
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
        text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="relative w-20 h-20">
            <div className="w-full h-full rounded-xl bg-white/30 dark:bg-slate-700/40 
              text-gray-50 dark:text-gray-100 flex items-center justify-center text-2xl font-bold">
              {getInitials()}
            </div>

            {/* EDIT ICON */}
            <button
              onClick={() =>
                navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, {
                  state: admin,
                })
              }
              className="absolute -bottom-1 -right-1 bg-blue-500/80 dark:bg-blue-700/80 
              p-2 rounded-lg shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 transition"
            >
              <FaEdit className="text-white text-sm" />
            </button>
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-gray-50 dark:text-gray-100 text-xl font-semibold">
              {admin.first_name} {admin.last_name}
            </h2>

            <p className="text-gray-50 dark:text-gray-300 text-sm opacity-90">
              {admin.email}
            </p>

            {/* BADGES */}
            <div className="flex gap-2 mt-2">
              <span className="bg-blue-200/50 dark:bg-blue-500/50 text-gray-50 dark:text-gray-100 rounded-2xl text-[10px] px-2 py-0.5">
                {admin.role}
              </span>
              <span className="bg-green-200/50 dark:bg-green-500/50 text-gray-50 dark:text-gray-100 rounded-2xl text-[10px] px-2 py-0.5">
                {admin.status}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CHIP */}
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div className="text-gray-50 dark:text-gray-100 flex flex-col items-center justify-center px-6 py-3 rounded-xl 
            bg-white/10 dark:bg-slate-700/40 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
            <FaPhoneAlt className="text-lg mb-1 opacity-80" />
            <span className="text-[10px] uppercase tracking-wide opacity-70">
              Phone
            </span>
            <span className="text-sm font-semibold">
              {admin.phone_no || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-7">

        {/* PROFESSIONAL */}
        <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
          <h3 className="text-[18px] font-semibold mb-3 text-cyan-800 dark:text-gray-100">
            Professional Details
          </h3>

          <div className="space-y-2 text-sm bg-white/10 dark:bg-slate-700/40 
            text-cyan-700/90 dark:text-gray-300 p-3 rounded-xl shadow backdrop-blur-md">
            <p><strong>Role:</strong> {admin.role}</p>
            <p><strong>Department:</strong> {admin.department_id?.join(", ")}</p>
            <p><strong>Joined:</strong> {admin.created_on}</p>
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
          <h3 className="text-[18px] font-semibold mb-3 text-cyan-800 dark:text-gray-100">
            Contact Information
          </h3>

          <div className="space-y-2 text-sm bg-white/10 dark:bg-slate-700/40 
            text-cyan-700/90 dark:text-gray-300 p-3 rounded-xl shadow backdrop-blur-md">
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Phone:</strong> {admin.phone_no}</p>
          </div>
        </div>

        {/* CURRENT ADDRESS */}
        <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
          <h3 className="text-[18px] font-semibold mb-3 text-cyan-800 dark:text-gray-100">
            Current Address
          </h3>

          <div className="bg-white/10 dark:bg-slate-700/40 p-3 rounded-xl text-sm 
            text-cyan-700 dark:text-gray-200 shadow backdrop-blur-md">
            {admin.current_address?.address_line_1},{" "}
            {admin.current_address?.address_line_2},{" "}
            {admin.current_address?.city},{" "}
            {admin.current_address?.district},{" "}
            {admin.current_address?.state},{" "}
            {admin.current_address?.country},{" "}
            {admin.current_address?.pin}
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
          <h3 className="text-[18px] font-semibold mb-3 text-cyan-800 dark:text-gray-100">
            Permanent Address
          </h3>

          <div className="bg-white/10 dark:bg-slate-700/40 p-3 rounded-xl text-sm 
            text-cyan-700 dark:text-gray-200 shadow backdrop-blur-md">
            {admin.permanent_address?.address_line_1},{" "}
            {admin.permanent_address?.address_line_2},{" "}
            {admin.permanent_address?.city},{" "}
            {admin.permanent_address?.district},{" "}
            {admin.permanent_address?.state},{" "}
            {admin.permanent_address?.country},{" "}
            {admin.permanent_address?.pin}
          </div>
        </div>

      </div>
    </div>
  </div>
);
};

export default AdminProfileView;