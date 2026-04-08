

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Patients" value="1,240" />
        <Card title="Total Doctors" value="85" />
        <Card title="Today’s Appointments" value="32" />
        <Card title="Pending Approvals" value="6" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Appointments
          </h2>

          <table className="w-full text-sm">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="text-left py-2">Patient</th>
                <th className="text-left py-2">Doctor</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                patient="Rohit Sharma"
                doctor="Dr. Mehta"
                date="04 Feb 2026"
                status="Upcoming"
              />
              <TableRow
                patient="Ananya Sen"
                doctor="Dr. Roy"
                date="04 Feb 2026"
                status="Completed"
              />
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Add Doctor
            </button>
            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              View Appointments
            </button>
            <button className="w-full border rounded-md py-2 hover:bg-gray-100">
              Manage Users
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

/* Small Components */

const Card = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

const TableRow = ({
  patient,
  doctor,
  date,
  status,
}: {
  patient: string;
  doctor: string;
  date: string;
  status: string;
}) => (
  <tr className="border-b last:border-none">
    <td className="py-2">{patient}</td>
    <td className="py-2">{doctor}</td>
    <td className="py-2">{date}</td>
    <td className="py-2">
      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
        {status}
      </span>
    </td>
    <td className="py-2">
      <button className="text-blue-600 hover:underline">
        View
      </button>
    </td>
  </tr>
);
