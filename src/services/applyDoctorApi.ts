import { urls } from "../Environment";
import { API } from "./api";

/* ================= APPLY DOCTOR API ================= */

export interface ApplyDoctorForm {

  name: string;
  specialization: string;
  email: string;
  phone: string;

}

export const applyDoctorApi = (formData: FormData) => {

  return API.post(

    urls.applyDoctorUrl,

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data"
      },

      validateStatus: () => true

    }

  );

};
