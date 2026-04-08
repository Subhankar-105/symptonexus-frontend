
import { urls, type Role } from "../Environment";
import { API } from "./api";

/* ---------- Types ---------- */

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface SignupPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  gender: number;
}

export interface SendOtpPayload {
  email: string;
  role: Role;
}

export interface VerifyOtpPayload {
  otp: string;
  token: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}


/* ---------- API Calls ---------- */

export const loginApi = (data: LoginPayload) => {
  return API.post(urls.loginUrl, data, {
    validateStatus: () => true, //  accept all statuses
  });
};

export const signupApi = (data: SignupPayload) => {
  return API.post(urls.signupUrl, data);
};

/* ---------- FORGOT PASSWORD ---------- */

export const sendOtpApi = (data: SendOtpPayload) => {
  return API.post(urls.sendOtpUrl, data, {
    validateStatus: () => true
  });
};

export const verifyOtpApi = (data: VerifyOtpPayload) => {
  return API.post(urls.verifyOtpUrl, data, {
    validateStatus: () => true
  });
};

export const resetPasswordApi = (data: ResetPasswordPayload) => {
  return API.post(urls.resetPasswordUrl, data, {
    validateStatus: () => true
  });
};