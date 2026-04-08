import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ================= USER TYPES ================= */

interface User {
  specialization: string;
  email: string;
  role: string;
  patient_id: number;
  admin_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_no: string;
  gender: string;
  dob?: string;
  department: string;
  created_on: string;
  doctor_no: string;
}


interface Menu {
  control_master_id: number;
  control_type: string;
  control_key: string;
  control_name: string;
  control_desc: string | null;
  status: string;
}

interface Button {
  control_master_id: number;
  control_type: string;
  control_key: string;
  control_name: string;
  control_desc: string | null;
  status: string;
}

/* ================= PROFILE TYPES ================= */

interface Address {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pin: string | null;
}

interface Profile {
  dob: string | null;
  marital_status: string | null;
  occupation: string | null;
  blood_group: number | null;
  height: number | null;
  weight: number | null;
  allergies: string[];
  smoking: boolean | null;
  alcohol: boolean | null;
  current_address: Address | null;
  permanent_address: Address | null;
  experience_years: string | null;
}

/* ================= AUTH STATE ================= */

interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  menus: Menu[];
  buttons: Button[]; 
  authChecked: boolean;
  profile: Profile | null;
}

/* ================= PAYLOAD ================= */

interface LoginSuccessPayload {
  token: string;
  user: User;
  profile: Profile;
  role: string;
  menus: Menu[];
  buttons: Button[];
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
  menus: [],
  buttons: [],
  authChecked: false,
  profile: null, 
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<LoginSuccessPayload>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.role = action.payload.role;
      state.menus = action.payload.menus;
      state.buttons = action.payload.buttons; 
      state.isAuthenticated = true;
      state.authChecked = true;
    },

    setProfile(
      state,
      action: PayloadAction<Profile>
    ) {
      state.profile = action.payload;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.profile = null;
      state.role = null;
      state.menus = [];
      state.buttons = [];  
      state.isAuthenticated = false;
      state.authChecked = true;
    },

    authCheckFinished(state) {
      state.authChecked = true;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  loginSuccess,
  logout,
  authCheckFinished,
  setProfile, // USE THIS AFTER SAVE / FETCH
} = authSlice.actions;

export default authSlice.reducer;
