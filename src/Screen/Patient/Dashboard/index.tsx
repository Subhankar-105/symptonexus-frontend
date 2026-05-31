import { useEffect, useState, useRef } from "react";
import { HEALTH_TIPS } from "../../../Environment";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { getAppointmentsApi, type Appointment } from "../../../services/appointmentApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

const Patientpage: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);

  const [upcomingAppointmentList, setUpcomingAppointmentList] =
  useState<Appointment[]>([]);

  const hasStarted = useRef(false);

  const navigate = useNavigate();
 
  const user = useSelector((state: RootState) => state.auth.user);
  // Mock data (replace with API later)
  const patientName = user?.first_name || "Patient";

  useEffect(() => {
    if (hasStarted.current) return;

    hasStarted.current = true;

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      if (!user?.patient_id) return;

      const appointments = await getAppointmentsApi({
        patient_id: user.patient_id,
      });

      setTotalAppointments(appointments.length);

      const upcoming = appointments.filter((appointment) =>
        ["Booking Confirmed", "Slot Assigned"].includes(
          appointment.booking_status
        )
      );

      setUpcomingAppointments(upcoming.length);
      setUpcomingAppointmentList(upcoming);

      const pending = appointments.filter(
        (appointment) =>
          appointment.booking_status === "Booking Initiated"
      );

      setPendingAppointments(pending.length);

    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  fetchAppointments();
}, [user]);
console.log(upcomingAppointmentList);
  return (
    <main className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-800 dark:text-gray-100">
          Welcome Back, {patientName} 
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />

        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
        />

        <StatCard
          title="Pending Appointments"
          value={pendingAppointments}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
        />

        <StatCard
          title="Completed Appointments"
          value="3"
          color="bg-gradient-to-br from-violet-500 to-fuchsia-600"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointments */}
        <section className="lg:col-span-2 p-6 border border-cyan-50/30 dark:border-gray-200/30 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition">
          <h2 className="text-xl font-semibold mb-4 text-cyan-950 dark:text-gray-100">
            Upcoming Appointments
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Doctor
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Specialty
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Status
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingAppointmentList.slice(0, 3).map((appointment) => (
                    <tr
                      key={appointment.appointment_id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-cyan-50/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-center font-semibold">
                            {appointment.doctor_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              Dr. {appointment.doctor_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {appointment.appointment_no}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {appointment.specialization}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700 dark:text-slate-200">
                          {dayjs(appointment.appointment_date).format(
                            "DD MMM YYYY"
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.booking_status ===
                              "Booking Confirmed" &&
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          } ${
                            appointment.booking_status ===
                              "Slot Assigned" &&
                            "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                          }`}
                        >
                          {appointment.booking_status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button 
                        onClick={() => {
                          navigate(
                            `/patient/my_appointments/booking_details/${appointment.appointment_id}`, { state: appointment });
                          
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        {/* Health Tip */}
          <h2 className="text-lg font-semibold mb-2 text-gray-950 dark:text-gray-100">
            Daily Health Tip
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            {HEALTH_TIPS[tipIndex]}
          </p>
      </div>
    </main>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
}) => (
  <div
    className={`
      ${color}
      relative overflow-hidden
      text-white
      rounded-3xl
      p-7

      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-1

      transition-all duration-300
    `}
  >
    {/* Glow Effect */}
    <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

    {/* Title */}
    <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">
      {title}
    </p>

    {/* Value */}
    <h3 className="text-4xl font-extrabold mt-4 tracking-tight">
      {value}
    </h3>
  </div>
);

export default Patientpage;