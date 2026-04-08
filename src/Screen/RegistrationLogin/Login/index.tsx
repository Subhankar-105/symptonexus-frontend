import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";
import { loginApi } from "../../../services/authApi";
import type { LoginPayload } from "../../../services/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { loginSuccess } from "../../../../store/slices/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  //  ROLE FROM URL
  const selected: Role = getRoleFromUrl(location.search);

  // ================= STATE =================
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= LOGIN HANDLER =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setIdError("");
    setPasswordError("");

    if (!id || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const payload: LoginPayload = {
  email: id,
  password,
  role: selected.toLowerCase() as Role
};

      const res = await loginApi(payload);

      /* ================= SUCCESS ================= */
      if (res.data.success) {
        const { token, role, user, profile, menus, buttons } = res.data.data;

        //  REDUX UPDATE (IMPORTANT)
        dispatch(
          loginSuccess({
            token,
            user,
            profile,
            role,
            menus,
            buttons
          })
        );

        //  Persist
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("profile", JSON.stringify(profile));
        localStorage.setItem("role", role);
        localStorage.setItem("menus", JSON.stringify(menus));
        localStorage.setItem("buttons", JSON.stringify(buttons));
        //  Role-based navigation
        if (role?.includes("admin")) {
  navigate("/admin");
} else if (role === "doctor") {
  navigate("/doctor");
} else if (role === "patient") {
  navigate("/patient");
} else {
  navigate("/");
}

        return;
      }

      /* ================= FAILURE ================= */
      const { message, errorCode } = res.data;

      if (errorCode === "ROLE_MISMATCH") {
  toast.error(`This account is not registered as ${selected}`);
  return;
}

if (errorCode === "USER_NOT_FOUND") {
  setIdError(message || "Invalid User ID");
  toast.error(message || "Invalid User ID");
} 
else if (errorCode === "INVALID_PASSWORD") {
  setPasswordError(message || "Invalid Password");
  toast.error(message || "Invalid Password");
} 
else {
  toast.error(message || "Login failed");
}
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ROLE SWITCH =================
  const switchRole = (role: Role) => {
    navigate(`/registrationlogin/login?role=${role}`);
    setId("");
    setPassword("");
    setIdError("");
    setPasswordError("");
  };

  return (
    <div>
      {/* ROLE SWITCH */}
      <div className="flex justify-center gap-3 mb-6">
        {(["doctor", "patient", "admin"] as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-4 py-2 rounded-md font-semibold capitalize transition-all 
              ${
                selected === role
                  ? "bg-sky-800 dark:bg-gray-500 text-gray-100 dark:text-white shadow-md"
                  : "bg-cyan-600 dark:bg-gray-800 text-gray-100 dark:text-gray-300 hover:bg-cyan-700 dark:hover:bg-gray-700"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* HEADING */}
      <h2 className="text-2xl text-center mb-6 text-cyan-700 dark:text-gray-100 font-bold">
        {selected.charAt(0).toUpperCase() + selected.slice(1)} Login
      </h2>

      {/* FORM */}
      <form className="space-y-4" onSubmit={handleLogin}>
        {/* USER ID */}
        <div>
          <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-200">
            {selected === "doctor"
              ? "Doctor ID"
              : selected === "admin"
              ? "Admin ID"
              : "Email"}
          </label>

          <input
            type="text"
            value={id}
            disabled={loading}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-black dark:border-gray-100 text-gray-950 dark:text-gray-200 "
            placeholder={
              selected === "doctor"
                ? "Enter Doctor ID"
                : selected === "admin"
                ? "Enter Admin ID"
                : "Enter Your Email"
            }
          />

          {idError && (
            <p className="text-sm text-red-500 mt-1 pl-3">
              {idError}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-200">
            Password
          </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-12 rounded-full border  border-black dark:border-gray-100 text-gray-950 dark:text-gray-200 "
            placeholder="Enter Your Password"
          />

          {/* Eye Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeSlashIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
          {passwordError && (
            <p className="text-sm text-red-500 mt-1 pl-3">
              {passwordError}
            </p>
          )}
          { selected !== "admin" && (
          <div className="text-right mt-1">
            <Link
              to={`/registrationlogin/forgot-password?role=${selected}`}
              className="text-sm text-cyan-700 dark:text-gray-400 hover:underline hover:text-cyan-900 dark:hover:text-gray-300"
            >
              Forgot Password?
            </Link>
          </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-gradient-to-r  from-cyan-500  to-cyan-800 hover:from-cyan-600 hover:to-cyan-950 dark:from-cyan-950 dark:to-cyan-700 dark:hover:from-cyan-900 dark:hover:to-cyan-600 text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* REGISTER */}
      {selected === "patient" && (
        <p className="text-center mt-4 text-black dark:text-gray-200">
          New here?{" "}
          <Link to="/registrationlogin/signup" className="text-cyan-700 dark:text-cyan-500 hover:text-cyan-900 dark:hover:text-cyan-300">
            Register Now
          </Link>
        </p>
      )}
    </div>
  );
};

export default Login;
