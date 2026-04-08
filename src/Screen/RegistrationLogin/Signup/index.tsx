import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../../services/authApi";
import {
  genderOptions,
  isValidGender,
  getPasswordStrength,
  doPasswordsMatch,
  isStrongPassword,
  isValidEmail,
  isValidPhone
} from "../../../Environment";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/* ================= CONSTANTS ================= */

const PATIENT_ROLE_ID = 5;

/* ================= REQUIRED STAR ================= */

const RequiredStar = ({ required }: { required?: boolean }) =>
  required ? (
    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 text-sm font-bold pointer-events-none">
      *
    </span>
  ) : null;

/* ================= GENDER MAPPING ================= */

const genderToNumber: Record<string, number> = {
  male: 1,
  female: 2,
  other: 3,
};

/* ================= TYPES ================= */

interface ApiErrorResponse {
  message?: string;
  errorCode?: string;
}

/* ================= COMPONENT ================= */

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = doPasswordsMatch(
    formData.password,
    formData.confirmPassword
  );

  /* ================= INPUT HANDLER ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setEmailError("");

    /* ---------- FRONTEND VALIDATION ---------- */

    if (!isValidGender(formData.gender)) {
      toast.error("Please select a valid gender");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

  if (!isValidEmail(formData.email.trim())) {
  toast.error("Please select a valid email");
  return;
}

if (!isValidPhone(formData.phone.trim())) {
  toast.error("Please enter a valid 10-digit phone number");
  return;
}

    try {
      setLoading(true);

      const payload = {
        first_name: formData.firstName.trim(),
        middle_name: formData.middleName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        gender: genderToNumber[formData.gender],
        role_id: PATIENT_ROLE_ID,
      };

      await signupApi(payload);

      // SUCCESS (200)
      toast.success("Account created successfully");
      navigate("/registrationlogin/login?role=patient", { replace: true });

    } catch (error: unknown) {
      // HANDLE BUSINESS ERRORS (400)
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as {
          response?: {
            status?: number;
            data?: ApiErrorResponse;
          };
        };

        if (err.response?.status === 400) {
          const { message, errorCode } = err.response.data || {};

          if (errorCode === "EMAIL_ALREADY_EXISTS") {
            setEmailError(message || "Email already registered");
            toast.error(message || "Email already registered");
            return;
          }

          if (errorCode === "Password_do_not_match") {
            toast.error(message || "Passwords do not match");
            return;
          }

          toast.error(message || "Validation error");
          return;
        }
      }

      //  REAL SERVER ERROR (500 etc.)
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 rounded-xl">

        <h2 className="text-2xl font-bold text-center text-cyan-600 dark:text-gray-200 mb-6">
          Create Patient Account
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
          </div>

          <div className="md:col-span-2">
            <input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
          </div>

          <div className="md:col-span-2 relative">
            <RequiredStar required />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-500 dark:text-gray-400"
            >
              <option value="  ">Select Gender</option>
              {genderOptions.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 relative">
            <RequiredStar required />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
             {/* Eye Icon */}
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute inset-y-0 right-3 flex items-center pb-7 text-gray-500 dark:text-gray-400"
               >
                 {showPassword ? (
                   <EyeIcon className="w-5 h-5" />
                 ) : (
                   <EyeSlashIcon className="w-5 h-5" />
                 )}
               </button>
            <small className="text-gray-700 dark:text-gray-200">{passwordStrength}</small>
          </div>

          <div className="md:col-span-3 relative">
            <RequiredStar required />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded-md border-gray-900 dark:border-gray-300 text-gray-950 dark:text-gray-200"
            />
          {/* Eye Icon */}
             <button
               type="button"
               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
               className="absolute inset-y-0 right-3 flex items-center pb-7 text-gray-500 dark:text-gray-400"
             >
               {showConfirmPassword ? (
                 <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
          </div>

          <button
            disabled={loading}
            className="md:col-span-6 py-2 rounded-md bg-gradient-to-r  from-cyan-500  to-cyan-800 hover:from-cyan-600 hover:to-cyan-950 dark:from-cyan-950 dark:to-cyan-700 dark:hover:from-sky-400 dark:hover:to-cyan-600 text-white  disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-black dark:text-gray-200">
          Already have an account?{" "}
          <Link to="/registrationlogin/login?role=patient" className="text-cyan-700 dark:text-cyan-500 hover:underline hover:text-cyan-900 dark:hover:text-cyan-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
