import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllAdminsApi } from "../../src/services/createAdminApi";
import type { RootState } from "../store";

/* ================= ADMIN TYPES ================= */

interface AdminUserInfo {
  user_type: string;
}

interface Address {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pin: string | null;

}

interface Admin {
  admin_user_id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  role: string;
  gender?: string;
  email?: string;
  phone_no: string;
  created_on?: string;
  user?: AdminUserInfo;
  department_id?: number[] | null;
  status?: string;
  current_address?: Address | null;
  permanent_address?: Address | null;
}

/* ================= ADMIN STATE ================= */

interface AdminState {
  admins: Admin[];
  loading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AdminState = {
  admins: [],
  loading: false,
};

/* ================= THUNK ================= */

export const fetchAllAdmins = createAsyncThunk<Admin[]>(
  "admin/alladmins",
  async () => {
    return await getAllAdminsApi();
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.admin.loading) return false;
      return true;
    },
  }
);

/* ================= SLICE ================= */

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addAdmin(state, action: PayloadAction<Admin>) {
      state.admins.push(action.payload);
    },

    setAdmins(state, action: PayloadAction<Admin[]>) {
      state.admins = action.payload;
    },

    clearAdmins(state) {
      state.admins = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllAdmins.fulfilled,
        (state, action: PayloadAction<Admin[]>) => {
          state.loading = false;
          state.admins = action.payload;
        }
      )
      .addCase(fetchAllAdmins.rejected, (state) => {
        state.loading = false;
      });
  },
});

/* ================= EXPORTS ================= */

export const { addAdmin, setAdmins, clearAdmins } = adminSlice.actions;
export default adminSlice.reducer;
