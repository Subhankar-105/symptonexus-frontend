import { urls } from "../Environment";
import { API } from "./api";

/* ---------- Types ---------- */

export interface AddressPayload {
   address_line: string;   // REQUIRED
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface PatientProfilePayload {
  patient_id: number;
  dob?: string;
  marital_status?: string;
  occupation?: string;
  blood_group?: number;
  height?: number;
  weight?: number;
  allergies?: string[];
  smoking?: boolean;
  alcohol?: boolean;
  current_address?: AddressPayload;
  permanent_address?: AddressPayload;
}

/* ---------- API Call ---------- */

export const savePatientProfileApi = (data: PatientProfilePayload) => {
  return API.post(urls.profileurl, data, {
    validateStatus: () => true, // accept all status codes
  });
};
