import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  appointmentRequestApi,
  getAppointmentsApi,
  getPendingAppointmentsApi,
} from "../../src/services/appointmentApi";

import type {
  Appointment,
  PendingAppointment,
  AppointmentRequestPayload,
  GetAppointmentsParams,
} from "../../src/services/appointmentApi";

interface AppointmentState {
  loading: boolean;
  appointments: Appointment[];
  pendingAppointments: PendingAppointment[];
  bookedAppointment: Appointment | null;
  error: string | null;
}

const initialState: AppointmentState = {
  loading: false,
  appointments: [],
  pendingAppointments: [],
  bookedAppointment: null,
  error: null,
};

/* ================= BOOK APPOINTMENT ================= */

export const bookAppointmentThunk = createAsyncThunk<
  Appointment,
  AppointmentRequestPayload,
  { rejectValue: string }
>(
  "appointment/bookAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await appointmentRequestApi(payload);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to book appointment"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to book appointment";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

/* ================= GET APPOINTMENTS ================= */

export const fetchAppointmentsThunk = createAsyncThunk<
  Appointment[],
  GetAppointmentsParams | undefined,
  { rejectValue: string }
>(
  "appointment/fetchAppointments",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getAppointmentsApi(params);
      return data;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch appointments";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

/* ================= GET PENDING APPOINTMENTS ================= */

export const fetchPendingAppointmentsThunk = createAsyncThunk<
  PendingAppointment[],
  void,
  { rejectValue: string }
>(
  "appointment/fetchPendingAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPendingAppointmentsApi();
      return data;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch pending appointments";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearBookedAppointment: (state) => {
      state.bookedAppointment = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
    clearPendingAppointments: (state) => {
      state.pendingAppointments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* BOOK APPOINTMENT */
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        bookAppointmentThunk.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.bookedAppointment = action.payload;

          const alreadyExists = state.appointments.some(
            (item) => item.appointment_id === action.payload.appointment_id
          );

          if (!alreadyExists) {
            state.appointments.unshift(action.payload);
          }
        }
      )
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to book appointment";
      })

      /* GET APPOINTMENTS */
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch appointments";
      })

      /* GET PENDING APPOINTMENTS */
      .addCase(fetchPendingAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPendingAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<PendingAppointment[]>) => {
          state.loading = false;
          state.pendingAppointments = action.payload;
        }
      )
      .addCase(fetchPendingAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch pending appointments";
      });
  },
});

export const {
  clearAppointmentError,
  clearBookedAppointment,
  clearAppointments,
  clearPendingAppointments,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;