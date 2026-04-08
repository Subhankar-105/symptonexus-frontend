import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaEdit,
  FaUserCircle,
  FaMapMarkerAlt,
  FaHome,
  FaStethoscope,
  FaBriefcaseMedical,
  FaIdCard,
  FaUser,
} from "react-icons/fa";

import {
  MdEmail,
  MdPhone,
  MdCake,
  MdWork,
  MdVerified,
} from "react-icons/md";

import { GiMedicalPack } from "react-icons/gi";

import { FaClipboardList } from "react-icons/fa6";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { setSelectedDoctor } from "../../../../store/slices/doctorSlice";

const DoctorViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const doctorFromState = location.state;

  const doctorFromStore = useSelector(
    (state: RootState) => state.doctor.selectedDoctor
  );

  
  const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canEditProfile = buttons?.some(
    (btn) => btn.control_key === "edit doc profile"
  );

    const canDeleteProfile = buttons?.some(
    (btn) => btn.control_key === "delete doc account"
  );

  
  const doctorFromStorage = localStorage.getItem("selectedDoctor");

  const doctor =
    doctorFromState ||
    doctorFromStore ||
    (doctorFromStorage ? JSON.parse(doctorFromStorage) : null);

  useEffect(() => {
    if (doctorFromState) {
      dispatch(setSelectedDoctor(doctorFromState));
      localStorage.setItem("selectedDoctor", JSON.stringify(doctorFromState));
    } else if (!doctorFromStore && doctorFromStorage) {
      dispatch(setSelectedDoctor(JSON.parse(doctorFromStorage)));
    }
  }, [doctorFromState, doctorFromStore, doctorFromStorage, dispatch]);

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  const dob = doctor.dob || null;

  const initials =
    doctor.first_name?.charAt(0)?.toUpperCase() +
    doctor.last_name?.charAt(0)?.toUpperCase();

  const fullName = `${doctor.first_name} ${doctor.middle_name || ""} ${doctor.last_name}`.trim();

  const image = localStorage.getItem("profileImage");

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto space-y-6 bg-sky-200/30 dark:bg-slate-900/30 p-5 rounded-2xl shadow">

        {/* HEADER CARD */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-500 dark:from-cyan-900 dark:via-blue-900 dark:to-cyan-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              
              {/* AVATAR */}
              <div className="w-full h-full rounded-xl bg-white/30 dark:bg-gray-400/80 text-gray-50 dark:text-black flex items-center justify-center text-2xl font-bold overflow-hidden">
                {image ? (
                  <img src={image} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  initials
                )}
              </div>

              {/* STETHOSCOPE ICON */}
              <div className="absolute -bottom-1 -right-1 bg-green-500/80 dark:bg-green-700/80 p-2 rounded-lg shadow-md backdrop-blur-sm">
                <FaStethoscope className="text-white dark:text-gray-800 text-sm" />
              </div>

            </div>

            <div>
              <p className="text-gray-50 dark:text-gray-100 text-[10px] bg-white/20 dark:bg-gray-400/50 border border-white/25 dark:border-gray-400/90 px-3 py-1 rounded-full inline-block mb-1">
                From {doctor.created_on}
              </p>

              <span className="flex items-center gap-2">
                <h2 className="text-gray-50 dark:text-gray-100 text-xl font-semibold">
                  Dr. {fullName} 
                </h2>
                <p className="bg-cyan-200/50 dark:bg-green-500/50 text-gray-50 dark:text-gray-800 rounded-2xl text-[8.5px] px-1.5 py-0.5">
                  {doctor.status}
                </p>
              </span>

              <p className="text-gray-50 dark:text-gray-300 text-sm opacity-90 flex items-center gap-1 shrink-0">
                <MdEmail className="pt-0.5" /> {doctor.email}
              </p>
            </div>
          </div>

          {/* RIGHT INFO CHIPS */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">

            {/* PHONE */}
            <div className="text-gray-50 dark:text-gray-900 flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 dark:bg-gray-400/50 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <MdPhone className="text-lg mb-1 opacity-80" />
              <span className="dark:text-gray-100 text-[10px] uppercase tracking-wide opacity-70">
                Phone
              </span>
              <span className="text-sm font-semibold">
                {doctor.phone_no || "—"}
              </span>
            </div>

            {/* GENDER */}
            <div className="text-gray-50 dark:text-gray-900 flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 dark:bg-gray-400/50 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <FaUserCircle className="text-lg mb-1 opacity-80" />
              <span className="dark:text-gray-100 text-[10px] uppercase tracking-wide opacity-70">
                Gender
              </span>
              <span className="text-sm font-semibold">
                {doctor.gender || "—"}
              </span>
            </div>

            {/* DOB */}
            <div className="text-gray-50 dark:text-gray-900 flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 dark:bg-gray-400/50 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <MdCake className="text-lg mb-1 opacity-80" />
              <span className="dark:text-gray-100 text-[10px] uppercase tracking-wide opacity-70">
                DOB
              </span>
              <span className="text-sm font-semibold">
                {dob || "—"}
              </span>
            </div>

            {/* EXPERIENCE */}
            <div className="text-gray-50 dark:text-gray-900 flex flex-col items-center justify-center px-6 py-3 rounded-xl 
              bg-white/10 dark:bg-gray-400/50 backdrop-blur-md border border-white/20 shadow-md min-w-[130px]">
              <FaBriefcaseMedical className="text-lg mb-1 opacity-80" />
              <span className="dark:text-gray-100 text-[10px] uppercase tracking-wide opacity-70">
                Experience
              </span>
              <span className="text-sm font-semibold">
                {Number(doctor.experience)} year{Number(doctor.experience) > 1 ? "s" : ""}
              </span>
            </div>

          </div>
        </div>

        {/* EDIT BUTTON */}
        {canEditProfile && (
          <div>
            <button
              onClick={() =>
                navigate(`/admin/doctor_edit_profile/${doctor.doctor_id}`, { state: doctor })
              }
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-7">

          {/* PROFESSIONAL */}
          <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
            <h3 className="text-[18px] font-semibold mb-3 flex items-center gap-2 text-cyan-800 dark:text-gray-100 ">
              <GiMedicalPack className="text-[20px]" /> Professional Details
            </h3>

            <div className="space-y-2 text-sm bg-white/10 dark:bg-slate-700/40 text-cyan-700/90 dark:text-gray-300 p-3 rounded-xl barder border-white/30 shadow backdrop-blur-md">
              <p className="flex items-center gap-1 pl-0.5"><FaIdCard /><strong>Doctor ID:</strong> {doctor.doctor_no}</p>
              <p className="flex items-center gap-1 pl-0.5"><MdVerified /><strong>Licence:</strong> {doctor.licence_number || "—"}</p>
              <p className="flex items-center gap-1 pl-0.5"><FaClipboardList /><strong>Registration:</strong> {doctor.registration_number || "—"}</p>
              <p className="flex items-center gap-1 pl-0.5"><FaStethoscope /><strong>Specialization:</strong> {doctor.specialization || "—"}</p>
              <p className="flex items-baseline gap-1 pl-0.5"><FaUser /><strong>Bio:</strong> {doctor.bio || "—"}</p>
            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-800 dark:text-gray-100">
              <MdWork className="text-[20px]" /> Experience
            </h3>

            {doctor?.doctor_experiences?.length ? (
              <div className="space-y-2 text-sm bg-white/10 dark:bg-slate-700/40 p-3 rounded-xl border-white/30 shadow backdrop-blur-md">
                <div className="border-l-2 border-cyan-400 dark:border-gray-200 pl-4 space-y-2">
                  <p className="font-medium text-cyan-700/90 dark:text-gray-300">
                    {doctor.doctor_experiences[0]?.organization_name}
                  </p>

                  <p className="text-sm text-cyan-600/90 dark:text-zinc-300">
                    {doctor.doctor_experiences[0]?.designation}
                  </p>

                  <p className="text-xs text-blue-500/90 dark:text-neutral-300">
                    {doctor.doctor_experiences[0]?.start_date} →{" "}
                    {doctor.doctor_experiences[0]?.end_date}
                  </p>
                </div>
              </div>
            ) : (
              <p>-</p>
            )}
          </div>

          {/* CURRENT ADDRESS */}
          <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-800 dark:text-gray-100">
              <FaMapMarkerAlt className="text-[20px]" /> Current Address
            </h3>

            <div className="bg-white/10 dark:bg-slate-700/40 p-3 rounded-xl grid grid-cols-2 gap-2 text-sm text-cyan-700 dark:text-gray-200 border-white/30 shadow backdrop-blur-md">
              <p>{doctor?.doctor_address?.current_address?.address_line_1 || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.address_line_2 || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.city || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.district || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.state || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.country || "—"}</p>
              <p>{doctor?.doctor_address?.current_address?.pin || "—"}</p>
            </div>
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="bg-white/25 dark:bg-slate-800/40 rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-800 dark:text-gray-100">
              <FaHome className="text-[20px]"/> Permanent Address
            </h3>

            <div className="bg-white/10 dark:bg-slate-700/40 p-3 rounded-xl grid grid-cols-2 gap-2 text-sm text-cyan-700 dark:text-gray-200 border-white/30 shadow backdrop-blur-md">
              <p>{doctor?.doctor_address?.permanent_address?.address_line_1 || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.address_line_2 || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.city || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.district || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.state || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.country || "—"}</p>
              <p>{doctor?.doctor_address?.permanent_address?.pin || "—"}</p>
            </div>
          </div>
        </div>

        {/* DELETE */}
        <div className="flex justify-end">
          {canDeleteProfile && (
            <button className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
              Deactivate Account
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorViewProfile;