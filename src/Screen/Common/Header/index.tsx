import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import {FiLogIn} from "react-icons/fi";
import Theme from "../Theme/Theme";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";
import logo from "../../../assets/logo_outline.png";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);


  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  /* ---------- HOME ---------- */
  const goToHome = () => {
  localStorage.removeItem("token");
  dispatch(logout());    
  navigate("/");
};



  /* ---------- SIGN IN TOGGLE ---------- */
  const handleSignInClick = () => {
    if (location.pathname.startsWith("/registrationlogin")) {
      navigate("/");
    } else {
      navigate("/registrationlogin/login");
    }
  };

  /* ---------- DATE & TIME ---------- */
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* ================= TOP HEADER (ALWAYS VISIBLE) ================= */}
      <header className="h-16 bg-linear-to-r from-cyan-700 via-cyan-600 to-sky-200 dark:from-slate-500 dark:via-sky-800 dark:to-sky-950 flex items-center justify-between px-3 shadow-md">
        

        <div
  onClick={goToHome}
  className="cursor-pointer select-none"
>
  <div className="flex items-center gap-1">
    {/* <div className="bg-white/20 p-2 rounded-full "> */}
    <img src={logo} alt="SymptoNexus Logo" className="w-10 h-10" />
      {/* </div> */}
    <div>
      <span className="text-2xl text-slate-200 dark:text-gray-900 font-bold">
        Sympto
      </span>
      <span className="text-2xl text-sky-950 dark:text-gray-300 font-bold">
        Nexus
      </span>

      <p className="text-xs text-bold text-gray-300 pt-1 dark:text-white leading-none">
        Guiding Your Path, From Concern to Calm
      </p>
    </div>
    </div>
  </div>
      {/* RIGHT NAV ITEMS */}
<div className="flex items-center text-sm text-white font-medium pl-10">

  {/* THEME */}
  <div className="w-20 flex justify-center">
    <Theme />
  </div>

  {/* DATE */}
  <div className="w-40 flex justify-center items-center gap-1">
    <span className="bg-gray-50 dark:bg-cyan-700 p-2 rounded-full">
      <FaRegCalendarAlt className="text-lg text-cyan-800 dark:text-gray-100" />
    </span>

    <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">{date}</span>
  </div>

  {/* TIME */}
  <div className="w-36 flex justify-center items-center gap-1">
    <span className="bg-gray-50 dark:bg-cyan-700 p-2 rounded-full ">
      <FaRegClock className="text-lg text-cyan-800 dark:text-gray-100" />
    </span>

    <span className="whitespace-nowrap text-cyan-900 dark:text-gray-100">{time}</span>
  </div>

  {/* SIGN IN / BACK */}
    {(!user || Object.keys(user).length === 0) && (
  <button
    onClick={handleSignInClick}
    className="flex items-center gap-2 px-6 h-11 rounded-lg font-semibold text-white 
               bg-linear-to-r from-sky-500 to-cyan-700 hover:from-sky-600 hover:to-cyan-900 
               dark:from-sky-800 dark:to-sky-900
               dark:hover:from-sky-700 dark:hover:to-sky-800
               transition-all"
  >
    <FiLogIn />
    <span>Sign In</span>
  </button>
)}
</div>
      </header>

      

    </div>
  );
};

export default Header;
