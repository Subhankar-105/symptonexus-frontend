import { urls } from "../Environment";
import { API } from "./api";

/* ---------- ADDRESS ---------- */
export interface AddressPayload {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pin?: string;
}

/* ---------- ADMIN PROFILE ---------- */
export interface AdminProfilePayload {
  dob?: string;
  current_address?: AddressPayload;
  permanent_address?: AddressPayload;
}

/* ---------- API ---------- */
export const saveAdminProfileApi = (
  admin_user_id: string,
  data: AdminProfilePayload
) => {
  return API.post(`${urls.adminProfileUrl}/${admin_user_id}`, data, {
    validateStatus: () => true,
  });
};