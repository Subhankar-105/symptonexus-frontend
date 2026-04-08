import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRoleFromUrl } from "../../../Environment";
import type { Role } from "../../../Environment";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  getPasswordStrength,
  doPasswordsMatch,
  isStrongPassword
} from "../../../Environment";
import {
  sendOtpApi,
  verifyOtpApi,
  resetPasswordApi
} from "../../../services/authApi";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const selected: Role = getRoleFromUrl(location.search);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  /* PASSWORD HELPERS */

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = doPasswordsMatch(password, confirmPassword);

  /* TIMER EFFECT */

  useEffect(() => {

    if (step === 2 && timer > 0) {

      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);

    }

    if (timer === 0) {
      setCanResend(true);
    }

  }, [timer, step]);

  /* FORMAT TIMER */

  const formatTime = (seconds: number) => {

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;

  };

  /* ================= SEND OTP ================= */

  const handleSendOtp = async () => {

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    setLoading(true);

    try {

      const res = await sendOtpApi({
        email,
        role: selected
      });

      if (res.data.success) {

        setToken(res.data.data.token);

        toast.success("OTP sent successfully");

        setStep(2);

        setTimer(30);
        setCanResend(false);

      } else {

        toast.error(res.data.message || "Failed to send OTP");

      }

    } catch (error) {

      console.error("SEND OTP ERROR:", error);

      toast.error("Server error");

    } finally {

      setLoading(false);

    }

  };

  /* ================= RESEND OTP ================= */

  const handleResendOtp = async () => {

    if (!canResend) return;

    try {

      const res = await sendOtpApi({
        email,
        role: selected
      });

      if (res.data.success) {

        toast.success("OTP resent");

        setTimer(300);
        setCanResend(false);

      }

    } catch {

      toast.error("Failed to resend OTP");

    }

  };

  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = async () => {

    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {

      const res = await verifyOtpApi({
        otp,
        token
      });

      if (res.data.success) {

        toast.success("OTP verified");

        setStep(3);

      } else {

        toast.error(res.data.message || "Invalid OTP");

      }

    } catch (error) {

      console.error("VERIFY OTP ERROR:", error);

      toast.error("Verification failed");

    } finally {

      setLoading(false);

    }

  };

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async () => {

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const res = await resetPasswordApi({
        password,
        confirmPassword,
        token
      });

      if (res.data.success) {

        toast.success("Password updated successfully");
       
      navigate(`/registrationlogin/login?role=${selected}`);

        setStep(1);

        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");

      } else {

        toast.error(res.data.message || "Reset failed");

      }

    } catch (error) {

      console.error("RESET PASSWORD ERROR:", error);

      toast.error("Server error");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div>

      <h2 className="text-2xl text-center mb-6 text-cyan-700 dark:text-gray-200 font-bold">
        Reset {selected.charAt(0).toUpperCase() + selected.slice(1)} Password
      </h2>

      <div className="space-y-4">

        {/* STEP 1 EMAIL */}

        {step === 1 && (
          <div>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-200">
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-6 rounded-full border border-black dark:border-gray-100 text-gray-950 dark:text-gray-200 "
              placeholder="Enter your registered email"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2  rounded-full bg-gradient-to-r  from-cyan-500  to-cyan-800 hover:from-cyan-600 hover:to-cyan-950 dark:from-cyan-700 dark:to-cyan-950 dark:hover:from-cyan-500 dark:hover:to-cyan-900 text-white font-semibold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 OTP */}

        {step === 2 && (
          <div>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-300">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-6 rounded-full border border-black dark:border-gray-100 text-gray-950 dark:text-gray-200"
              placeholder="Enter verification code"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2 rounded-full bg-gradient-to-r  from-cyan-500  to-cyan-800 hover:from-cyan-600 hover:to-cyan-950 dark:from-cyan-700 dark:to-cyan-950 dark:hover:from-cyan-500 dark:hover:to-cyan-900 text-white font-semibold"
            >
              Verify OTP
            </button>

            {/* RESEND OTP */}

            <div className="text-center mt-2">

              {canResend ? (

                <button
                  onClick={handleResendOtp}
                  className="text-gray-100 hover:text-gray-200 bg-gradient-to-r  from-cyan-500  to-cyan-800 hover:from-cyan-600 hover:to-cyan-950
                   dark:from-cyan-700 dark:to-cyan-950 dark:hover:from-cyan-500 dark:hover:to-cyan-900
                    font-semibold w-25 rounded-2xl  hover:text-cyan-800 hover:bg-cyan-200 text-sm"
                >
                  {loading ? "Resending..." : "Resend OTP"}
                </button>

              ) : (

                <p className="text-gray-500 dark:text-gray-200 text-sm">
                  Resend OTP in {formatTime(timer)}
                </p>

              )}

            </div>

          </div>
        )}

        {/* STEP 3 PASSWORD */}

        {step === 3 && (
          <div>
            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-200">
              New Password
            </label>

            <div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-full border text-gray-800 dark:text-gray-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-200"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>

              </div>

              {password && (
                <div className="flex justify-end mt-1 pr-3">
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {passwordStrength}
                  </span>
                </div>
              )}

            </div>

            <label className="block mb-1 pl-3 text-gray-800 dark:text-gray-200 mt-3">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 rounded-full border  text-gray-800 dark:text-gray-200"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-200"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5 " />
                )}
              </button>

            </div>

            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 dark:text-red-700 pl-3 mt-1">
                Passwords do not match
              </p>
            )}

              <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-2 rounded-full bg-gradient-to-r 
               from-cyan-500  to-cyan-700 hover:from-cyan-600 hover:to-cyan-900
                   dark:from-cyan-600 dark:to-cyan-950 dark:hover:from-cyan-500 dark:hover:to-cyan-900  text-gray-200 font-semibold mt-4"
            >
              Reset Password
            </button>


          </div>
        )}

        {/* BACK LINK */}

        <div className="text-right mt-1">
          <Link
            to={`/registrationlogin/login?role=${selected}`}
            className="text-sm text-cyan-700 dark:text-cyan-500 hover:underline hover:text-cyan-900 dark:hover:text-cyan-400"
          >
            Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;