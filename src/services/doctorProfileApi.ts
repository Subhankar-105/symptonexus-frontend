import { urls } from "../Environment";
import { API } from "./api";

export interface AddressPayload {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pin?: string;
}

export interface ExperiencePayload {
  organization_name?: string;
  start_date: string;
  end_date?: string;
  designation?: string;
  responsibilities?: string;
}

export interface DoctorProfilePayload {
  dob?: string;
  licence_number?: string;
  registration_number?: string;
  experience?: string;
  bio?: string;

  current_address?: AddressPayload;
  permanent_address?: AddressPayload;

  experiences?: ExperiencePayload[];
}

/* ---------- ONLY POST API ---------- */

export const saveDoctorProfileApi = (
  doctor_id: string,
  data: DoctorProfilePayload
) => {
  return API.post(`${urls.docProfileUrl}/${doctor_id}`, data, {
    validateStatus: () => true,
  });
};