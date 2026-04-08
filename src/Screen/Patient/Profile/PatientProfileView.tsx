import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { FiChevronRight } from "react-icons/fi";
import background from "../../../assets/apply_light.jpeg"
import dark_background from "../../../assets/doctor_light.webp"
import { FaUserCircle, FaRing, FaTint, FaWalking,
  FaSmoking,
  FaWineGlassAlt,
  FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";
import { MdEmail, MdPhone, MdCake, MdWork, MdHeight, MdMonitorWeight } from "react-icons/md";
import { GiMedicalPack } from "react-icons/gi";
import { RiVirusLine } from "react-icons/ri";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

import { setProfile } from "../../../../store/slices/authSlice";
import Swal from "sweetalert2";
import { deleteAccountApi } from "../../../services/accountDeleteApi";
import toast from "react-hot-toast";
import { logout } from "../../../../store/slices/authSlice";


interface Props {
  open: boolean;
  onClose: () => void;
}

const PatientProfileView: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  const hydrated = useRef(false);

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
 

  useEffect(() => {
    if (!profile && !hydrated.current) {
      const storedProfile = localStorage.getItem("patientProfile");
      if (storedProfile) {
        dispatch(setProfile(JSON.parse(storedProfile)));
      }
      hydrated.current = true;
    }
  }, [profile, dispatch]);

  if (!user) return null;

  const dob = profile?.dob || user?.dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

  const initials =
    user.first_name?.charAt(0).toUpperCase() +
    user.last_name?.charAt(0).toUpperCase();

  const fullName = `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim();



  return (
    <div>

        {/* Overlay */}
  <div
    className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
      open ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
    onClick={onClose}
  />

          {/* FLOATING ARROW OUTSIDE */}
         <div
          className={`fixed top-1/2 right-[418px] -translate-y-1/2 translate-x-1/2 z-[9999]
                      transition-transform duration-100
                      ${open ? "translate-x-1/2 opacity-100 visible " : "translate-x-full opacity-0 invisible"}`}
        >
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center
                         rounded-full bg-gray-200 shadow-lg 
                         text-cyan-700 hover:text-red-500 transition"
            >
              <FiChevronRight size={20} style={{ strokeWidth: 3 }} />
            </button>
          </div>


      
        {/* Drawer */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-80px-30px)] w-[420px] shadow-2xl z-50 min-h-[calc(100vh-110px)] 
          bg-cover flex flex-col justify-start 
           transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto  overflow-x-visible`} style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}
        onClick={onClose}
      >

      

          <div className=" bg-white/20 pb-5 rounded-4xl relative ml-7 mr-7 mt-20 mb-5  border border-white/20">

            {/* Profile Header */}
          {/* Avatar */}
          <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
            <div className="
              w-24 h-24 border-2 border-cyan-100 dark:border-cyan-800
              rounded-full mb-0 
              bg-cyan-600 dark:bg-gray-500
              flex items-center justify-center
              text-white text-2xl font-semibold
              shadow-lg
            ">
              {initials || "A"}
            </div>
            
          </div>

              {/* Edit Profile */}

          
            <button className="relative mt-5 ml-46 p-1 backdrop-blur-md bg-white/70 text-gray-500 dark:text-gray-700 hover:text-cyan-700 transition rounded-full">
              <PencilSquareIcon
                  onClick={() => navigate("/patient/profile")}
                  className="w-5 h-5 flex items-center pl-1"
                />
            </button>
        
              <h2 className="mt-2 ml-30 text-xl font-semibold text-gray-800">
                {fullName}
              </h2>

              <p className="text-gray-500 dark:text-gray-800 ml-20 flex items-center gap-2">
                <MdEmail /> {user.email}
              </p>


                    {/* Content */}
        <div className="ml-5 mr-5 mt-6 rounded-4xl">

  <div className="p-6 text-center rounded-4xl 
    bg-white/40 dark:bg-gray-500/40 ">

            {/* Personal +Medical + Allergies */}
            <div className="mt-2 p-2 grid grid-cols-1 gap-4 text-left">

                {/* Personal Details */}
              <div>
                  <h3 className="text-blue-800 dark:text-gray-800 font-semibold  flex items-center gap-2">
                    <FaUserCircle />Personal Details
                  </h3>

                 <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <MdPhone className="text-green-600"/> Phone no: {user.phone_no || "—"}
                  </span> 

                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <FaVenusMars className="text-amber-700 text-sm"/> Gender: {user.gender || "—"}
                  </span>

                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <MdCake className="text-amber-500 text-sm"/> Age: {age ?? "—"}
                  </span>

                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <MdWork className="text-blue-500 text-sm"/> Occupation: {profile?.occupation}
                  </span>

                   <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <FaRing className="text-rose-500 text-sm"/> Marital Status: {profile?.marital_status}
                  </span>


              </div>

                {/* Medical */}

              <div>
                <h3 className="text-cyan-800 dark:text-gray-800 font-semibold  flex items-center gap-2">
                  <GiMedicalPack /> Medical Details
                </h3>

                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                    <FaTint className="text-red-600"/> Blood Group: {profile?.blood_group}
                         </span>
                

              
                  <span className="font-sm flex items-center gap-2 text-black dark:text-white">
                  <MdHeight className="text-amber-600"/>  Height:{profile?.height}
                  </span>
                
                
                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <MdMonitorWeight className="text-pink-400"/> Weight:{profile?.weight}
                  </span>

                  <span className="font-sm flex  gap-2 text-black dark:text-white"> 
                  <RiVirusLine className="text-green-600 pt-1 text-2xl "/> Allergies: {profile?.allergies?.length
                    ? profile.allergies.join(", ")
                    : "—"}
                  </span>  
                
              </div>


              {/* Lifestyle */}
              <div>

  <h3 className="text-purple-600 dark:text-gray-800 font-semibold  flex items-center gap-2">
    <FaWalking className="text-lg"/> Lifestyle
  </h3>

                    <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <FaSmoking className="text-amber-600"/> Smoking: {profile?.smoking ? "Yes" : "No"}
                  </span>

                  <span className="font-sm flex items-center gap-2 text-black dark:text-white"> 
                  <FaWineGlassAlt className="text-pink-900"/> Alcohol: {profile?.alcohol ? "Yes" : "No"}
                  </span>


                </div>

              {/* Current Address */}
              <div>

                <h3 className="text-blue-600 dark:text-gray-800 font-semibold flex items-center gap-2">
                  <FaMapMarkerAlt/> Address
                </h3>

                <div className=" text-black dark:text-white text-sm mt-1 ml-3">

 

                  <p>
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
            
                    {/* DELETE BUTTON */}
                
              <div className=" border w-58 border-gray-400/30 mt-2 ml-1 items-center"></div>
                <div className="w-full flex justify-end ">
                  
                    <button
                      onClick={handleDeleteAccount}
                      type="button"
                      className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                    >
                      Deactivate Account
                    </button>
                  
                  
                </div>
            </div>



            </div>
            </div>

          </div>
        </div>
    </div>
  );
};

export default PatientProfileView;
