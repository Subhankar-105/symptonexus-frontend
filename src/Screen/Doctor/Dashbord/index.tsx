import React from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

interface QuickButtonProps {
  title: string;
  onclick?: () => void;
}

interface AppointmentRowProps {
  patient: string;
  time: string;
  problem: string;
  status: string;
}

/* ================= MAIN COMPONENT ================= */

const DoctorDashboard: React.FC = () => { 
  const navigate = useNavigate();
  return (
    <main className="flex-1 p-8 bg-gray-100 min-h-screen">

      {/* Welcome */}
      <h1 className="text-3xl font-semibold mb-1">
        Welcome back, Doctor 👨‍⚕️
      </h1>
      <p className="text-gray-600 mb-8">
        Here is your schedule and patient summary
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value="245"
          color="bg-blue-500"
        />
        <StatCard
          title="Today's Appointments"
          value="8"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Requests"
          value="3"
          color="bg-orange-500"
        />
        <StatCard
          title="Total Earnings"
          value="₹12,500"
          color="bg-purple-500"
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Appointment Table */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Today's Appointments
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-2">Patient</th>
                <th>Time</th>
                <th>Problem</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <AppointmentRow
                patient="Rahul Das"
                time="10:30 AM"
                problem="Chest Pain"
                status="Upcoming"
              />
              <AppointmentRow
                patient="Priya Sharma"
                time="11:45 AM"
                problem="Tooth Pain"
                status="Completed"
              />
              <AppointmentRow
                patient="Amit Roy"
                time="01:00 PM"
                problem="Headache"
                status="Pending"
              />
            </tbody>
          </table>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Quick Actions
          </h2>

          <QuickButton title="View All Appointments" onclick={() => navigate("/doctor/appointment_requests")}/>
          <QuickButton title="View Patient List" />
          <QuickButton title="Update Profile" />
          <QuickButton title="Check Earnings" />
        </section>
      </div>

      {/* Daily Reminder */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">
          Daily Reminder
        </h2>
        <p className="text-gray-600">
          💡 Always review patient history before consultation.
        </p>
      </section>

    </main>
  );
};

export default DoctorDashboard;


/* ================= COMPONENTS ================= */

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
}) => (
  <div className={`rounded-xl p-6 text-white shadow ${color}`}>
    <p>{title}</p>
    <h3 className="text-3xl font-bold mt-2">
      {value}
    </h3>
  </div>
);


const QuickButton: React.FC<QuickButtonProps> = ({
  title,onclick
}) => (
  <button 
  onClick={onclick}
  className="w-full p-4 border rounded-lg hover:bg-gray-100 text-left">
    {title}
  </button>
);


const AppointmentRow: React.FC<AppointmentRowProps> = ({
  patient,
  time,
  problem,
  status,
}) => (
  <tr className="border-b">
    <td className="py-3">{patient}</td>
    <td>{time}</td>
    <td>{problem}</td>

    <td>
      <span
        className={`px-2 py-1 rounded text-xs ${
          status === "Completed"
            ? "bg-green-100 text-green-700"
            : status === "Pending"
            ? "bg-orange-100 text-orange-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {status}
      </span>
    </td>

    <td>
      <button className="bg-teal-600 text-white px-3 py-1 rounded">
        View
      </button>
    </td>
  </tr>
);
