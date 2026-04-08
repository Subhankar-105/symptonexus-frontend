import { createAsyncThunk } from "@reduxjs/toolkit";
import { applyDoctorApi } from "../../src/services/applyDoctorApi";

export const applyDoctor = createAsyncThunk(

  "applyDoctor",

  async (formData: FormData, { rejectWithValue }) => {

    const response = await applyDoctorApi(formData);

    if (response.status !== 200) {

      return rejectWithValue(response.data.message);

    }

    return response.data;

  }

);
