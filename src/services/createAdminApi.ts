import { urls } from "../Environment";
import { API } from "./api";

/* ================= ADMIN TYPE ================= */

export interface Admin {
  admin_user_id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone_no: string;
  department_id?: number[];  
  role: string;  
  created_on: string;
}

/* ================= CREATE ADMIN PAYLOAD ================= */

export interface CreateAdminPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone_no: string;
  admin_type: number;   
  gender?: number;
  department_id?: number[];
  password: string;
  confirm_password: string; 
}

export interface deactivateAdminPayload {
  admin_user_id: number;
  status: "Active" | "Inactive";
}

/* ================= CREATE ADMIN API ================= */

export const createAdminApi = (data: CreateAdminPayload) => {
  return API.post(urls.createAdminUrl, data, {
    validateStatus: () => true,
  });
};

/* ================= GET ALL ADMINS API ================= */

export const getAllAdminsApi = async (): Promise<Admin[]> => {
  const response = await API.get(urls.getAllAdminsUrl);

  return response.data.data;
};


export const deactiveAdminApi = async (data: deactivateAdminPayload ) => {
  return API.put(urls.deactiveAdminUrl, data, { 
    validateStatus: () => true, 
  });
}