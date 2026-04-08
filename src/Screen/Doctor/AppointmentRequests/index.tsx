import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchPendingAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { cancelAppointmentsApi } from "../../../services/appointmentApi";
import { FaEnvelope, FaPhone, FaUser, FaVenusMars, FaHourglassHalf } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const AppointmentsRequests = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { pendingAppointments, loading, error } = useSelector(
    (state: RootState) => state.appointment
  );

  const hasFetched = useRef(false);

  const [showModal, setShowModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchPendingAppointmentsThunk());
  }, [dispatch]);


  const handleOpenCancelModal = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      setCancelLoading(true);

      const response = await cancelAppointmentsApi({
        appointment_id: selectedAppointmentId,
        action: "cancel",
      });

      if (response?.data?.success) {
        setShowModal(false);
        setSelectedAppointmentId(null);
        dispatch(fetchPendingAppointmentsThunk());
      } else {
        toast(response?.data?.message || "Failed to cancel appointment");
      }
    } catch {

      toast("Something went wrong while cancelling appointment");
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div
      className="bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100 
                    dark:from-sky-950 dark:via-sky-900 dark:to-sky-950 
                    p-6 min-h-screen w-full"
    >
      <h1 className="text-4xl font-bold mb-6 text-cyan-800 dark:text-cyan-50">
        Appointment Requests
      </h1>
      {loading && (
        <div className="text-cyan-900 dark:text-cyan-50 text-lg">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-lg mb-4">
          {error}
        </div>
      )}

      {!loading && pendingAppointments.length === 0 && (
        <div className="text-cyan-900 dark:text-cyan-50 text-lg">
          No appointment requests found
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-1">
        {!loading &&
          pendingAppointments.map((item) => {
    const dob = item.patient_dob || null;
    const age = dob ? dayjs().diff(dayjs(dob), "year") : null;
    return (
          <div
            className="bg-gradient-to-r from-cyan-100 to-cyan-200 
                       dark:from-sky-900 dark:to-cyan-800 
                       rounded-2xl shadow-md relative p-5
                       hover:scale-[1.01] transition"
          >
            <div className="text-[15px]">
              <div className="p-2 space-y-2">
                <h2 className="font-semibold text-[20px] text-cyan-900 dark:text-cyan-50 pl-1 pb-2">
                  Patient Details
                </h2>

                <div className="bg-white/30 backdrop-blur-md rounded-xl p-2 space-y-2">
                  <span className="flex items-center gap-2">
                    <FaUser /> {item.patient_name || "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaVenusMars /> {item.patient_gender || "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaHourglassHalf /> {age !== null ? `${age} years` : "N/A"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaPhone /> {item.patient_phone || "N/A"}
                  </span>

                  <span className="flex items-center gap-2 break-all">
                    <FaEnvelope /> {item.patient_email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-left font-medium text-cyan-900 dark:text-cyan-50 min-h-[90px]">
                symptom
            </div>

            <div className="mt-4 text-[12px] bg-white/30 backdrop-blur-md rounded-xl p-3 text-center font-medium text-cyan-900 dark:text-cyan-50">
              Requested Appointment: {item.appointment_date || "N/A"}
            </div>

            <div className="text-[24px] absolute top-0.5 right-3 pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCancelModal(item.appointment_id)}
                    className="rounded-xl text-red-600/80 px-4 py-1 hover:text-red-700/90 hover:scale-[1.05] transition"
                  >
                    <FiTrash2 />
                  </button>
            </div>
          </div>
        )})}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl shadow-xl p-6 w-[350px] text-center">

            {/* ICON */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-orange-300 flex items-center justify-center text-orange-400 text-3xl">
              !
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>

            {/* MESSAGE */}
            <p className="text-gray-600 mb-6">
              You want to cancel this appointment
            </p>

            {/* BUTTONS */}
            <div className="flex justify-center gap-3">

              {/* CONFIRM */}
              <button
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? "Cancelling..." : "Yes"}
              </button>

              {/* CANCEL */}
             <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointmentId(null);
                }}
                disabled={cancelLoading}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsRequests;
