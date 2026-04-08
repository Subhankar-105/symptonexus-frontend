import type { AxiosResponse } from "axios";
import { urls } from "../Environment";
import { API } from "./api";

export interface AcknowledgementPdfPayload {
  appointment_id: number;
  patient_id: number;
}

export const getAcknowledgementApi = (
  data: AcknowledgementPdfPayload
): Promise<AxiosResponse<Blob>> => {
  return API.post(urls.acknowledgementPdfUrl, data, {
    responseType: "blob",
    validateStatus: () => true,
  });
};