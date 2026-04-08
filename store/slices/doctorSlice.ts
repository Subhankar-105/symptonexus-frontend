import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createDoctorApi, getDoctorListApi, getpublicDoctorListApi } from "../../src/services/doctorApi";
import type { RootState } from "../store";


/* ================= DOCTOR TYPE ================= */



interface Address {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pin: string | null;

}

interface Experience {
  organization_name: string | null;
  designation: string | null;
  start_date: string | null;
  end_date: string | null;
  responsibilities: string | null;
}

interface Slot {
  doctor_availability_id?: number;
  date: string;
  slot_count: number;
  fees: number;
  start_time: string;
  end_time: string;
}

export interface Doctor {

  doctor_id: number;

  first_name: string;
  middle_name?: string | null;
  last_name: string;
  dob?: string | null;


  email: string;
  phone_no: string;

  gender?: string;    
  doctor_no?: string;
  license_number?: string;
  registration_number?: string;
  experience?: number;      
  specialization?: string;
  bio?: string;  
  status: string;
  current_address: Address | null;
  permanent_address: Address | null;

  doctor_experiences?: Experience[];
  
  doctor_availability?: Record<string, Slot>;

  created_on?: string;



}





/* ================= DOCTOR STATE ================= */

interface DoctorState {
  doctors: Doctor[];
  experiences: Experience[];
 slot: Record<
  number,
  Record<
    string,
    {
      doctor_availability_id?: number;
      slots: number;
      fee: string;
      start_time: string;
      end_time: string;
    }
  >
>;
  loading: boolean;
  selectedDoctor: Doctor | null;
}

const initialState: DoctorState = {
  doctors: [],
  experiences: [],
  slot: {},
  loading: false,
  selectedDoctor: null,
};




/* ================= CREATE PAYLOAD TYPE ================= */

interface CreateDoctorPayload {

  first_name: string;
  middle_name?: string;

  last_name: string;

  email: string;

  phone_no: string;

  gender: number;

  specialization: number;

  password: string;

  confirm_password: string;

}


/* ================= CREATE DOCTOR THUNK ================= */

export const createDoctorThunk = createAsyncThunk<Doctor, CreateDoctorPayload>(

  "doctor/create",

  async (payload, { rejectWithValue }) => {

    try {

      const response = await createDoctorApi(payload);

      if (response.data.success) {

        return response.data.data;

      }

      return rejectWithValue(response.data.message);

    } catch (error: unknown) {

      if (error instanceof Error) {

        return rejectWithValue(error.message);

      }

      return rejectWithValue("Failed to create doctor");

    }

  },

  {
    condition: (_, { getState }) => {

      const state = getState() as RootState;

      if (state.doctor.loading) return false;

      return true;

    }

  }

);


/* ================= FETCH DOCTOR LIST THUNK ================= */
export const fetchDoctorListThunk = createAsyncThunk<
  Doctor[],
  { specializationId?: number; isPatientRoute: boolean },
  { rejectValue: string }
>(
  "doctor/doctor-list",
  async ({ specializationId, isPatientRoute }, { rejectWithValue }) => {
    try {

      const res = isPatientRoute
        ? await getDoctorListApi(specializationId)        
        : await getpublicDoctorListApi(specializationId);

      return res;

    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch doctors");
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.doctor.loading) return false;
      return true;
    }
  }
);
/* ================= SLICE ================= */

const doctorSlice = createSlice({

  name: "doctor",

  initialState,

  reducers: {

    addDoctor(state, action: PayloadAction<Doctor>) {

      state.doctors.push(action.payload);

    },

    setSelectedDoctor(state, action: PayloadAction<Doctor | null>) {

  state.selectedDoctor = action.payload;

    },

    setDoctors(state, action: PayloadAction<Doctor[]>) {

      state.doctors = action.payload;
      

    },

    clearDoctors(state) {

      state.doctors = [];

    },

  },

  extraReducers: (builder) => {

    builder

      /* CREATE DOCTOR */

      .addCase(createDoctorThunk.pending, (state) => {

        state.loading = true;

      })

      .addCase(

        createDoctorThunk.fulfilled,

        (state, action: PayloadAction<Doctor>) => {

          state.loading = false;

          state.doctors.push(action.payload);

        }

      )

      .addCase(createDoctorThunk.rejected, (state) => {

        state.loading = false;

      })


      /* FETCH DOCTOR LIST */

      .addCase(fetchDoctorListThunk.pending, (state) => {

        state.loading = true;

      })

      .addCase(

        fetchDoctorListThunk.fulfilled,

        (state, action: PayloadAction<Doctor[]>) => {

          state.loading = false;

          state.doctors = action.payload;

          state.slot = {};

action.payload.forEach((doc) => {
 const availability = doc.doctor_availability || {};

if (!state.slot[doc.doctor_id]) {
  state.slot[doc.doctor_id] = {};
}

Object.entries(availability).forEach(([date, slot]) => {
  state.slot[doc.doctor_id][date] = {
    slots: slot.slot_count,
    fee: String(slot.fees),
    start_time: slot.start_time,
    end_time: slot.end_time
  };
  });
});

        }

      )

      .addCase(fetchDoctorListThunk.rejected, (state) => {

        state.loading = false;

      });

  },

});


/* ================= EXPORTS ================= */

export const {

  addDoctor,

  setDoctors,

  clearDoctors, 

  setSelectedDoctor

} = doctorSlice.actions;


export default doctorSlice.reducer;
