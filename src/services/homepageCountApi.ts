import { urls } from "../Environment";
import { API } from "./api";

/* ================= DASHBOARD COUNT TYPE ================= */

export interface DashboardCount {

  patientCount: number;

  doctorCount: number;

}

/* ================= SPECIALIZATION COUNT TYPE ================= */

export interface SpecializationCount {
  specialization_id: number;
  doctor_count: number;
}

/* ================= GET DASHBOARD COUNT API ================= */

export const getDashboardCountApi = async (): Promise<DashboardCount> => {

  const response = await API.get(
    urls.dashboardCountUrl
  );

  return response.data.data;

};

/* ================= GET SPECIALIZATION COUNT API ================= */

export const getSpecializationCountApi = async (): Promise<SpecializationCount[]> => {

  const response = await API.get(
    urls.specializationCountUrl
  );

  return response.data.data;

};