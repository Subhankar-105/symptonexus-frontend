import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey = "appointment_id" | "patient_name" | "doctor_name" | "specialization" | "appointment_date" | "appointment_time" | "status" | "action";



const AdminAppoinments = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );


    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [specializationFilter, setspecializationFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openSection, setOpenSection] = useState<"status" | "specialization" | "">("");
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
 


    /* ================= COLUMN WIDTH STATE ================= */
  
    const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
      appointment_id: 250,
      patient_name: 350,
      doctor_name: 250,
      specialization: 250,
      appointment_date: 150,
      appointment_time: 170,
      status: 100,
      action: 150
    });
  
    const resizingCol = useRef<ColumnKey | null>(null);
  
    const startResize = (
      _e: React.MouseEvent<HTMLDivElement>,
      column: ColumnKey
    ) => {
      resizingCol.current = column;
    };
  
    const stopResize = () => {
      resizingCol.current = null;
    };
  
    const resize = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!resizingCol.current) return;
  
      setColumnWidths((prev) => ({
        ...prev,
        [resizingCol.current!]: prev[resizingCol.current!] + e.movementX
      }));
    };
  
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    /* ================= FETCH APPOINTMENTS ================= */
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  dispatch(fetchAppointmentsThunk());
}, [dispatch]);



  /* ================= FILTER DOCTORS ================= */
 const filteredAppointments = (
  Array.isArray(appointments) ? appointments : []
)
    .filter((appointment) => {
      const statusName = (appointment.booking_status);

      const doctorName =
        appointment.doctor_name || "-";
      const specialization = appointment.specialization || "";
      const appointmentDate = appointment.appointment_date || "";
      const appointmentTime =
        appointment.slot_details?.start_time && appointment.slot_details?.end_time
          ? `${appointment.slot_details.start_time} - ${appointment.slot_details.end_time}`
          : appointment.booking_time || "";

      const matchesStatus =
        !statusFilter ||
        statusName.toLowerCase() === statusFilter.toLowerCase();

      const matchesSpecialization =
        !specializationFilter ||
        specialization.toLowerCase() === specializationFilter.toLowerCase();

      const matchesSearch =
        !search ||
        String(appointment.appointment_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        doctorName.toLowerCase().includes(search.toLowerCase()) ||
        specialization.toLowerCase().includes(search.toLowerCase()) ||
        appointmentDate.toLowerCase().includes(search.toLowerCase()) ||
        appointmentTime.toLowerCase().includes(search.toLowerCase()) ||
        statusName.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSpecialization && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a.created_on ? new Date(a.created_on).getTime() : 0;
      const dateB = b.created_on ? new Date(b.created_on).getTime() : 0;

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  /* ================= UI ================= */

  return (

    <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appointments </h2>
      </div>

      {/* SEARCH + FILTER */}
      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">

                
        <div className="flex items-center justify-between gap-3 mb-4">

          {/* FILTER BUTTON */}
          <div className="flex items-center justify-between gap-2">
                   <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200
            rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
          >
            <AdjustmentsHorizontalIcon className="text-cyan-700 dark:text-gray-100  w-5 h-5" />
            <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">Filter</span>
          </button>

<button
  onClick={() =>
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }
  className="  flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200
            rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
>
  <HiArrowsUpDown className=" text-cyan-700 dark:text-gray-100  w-5 h-5 " />
  <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">Sort</span>
</button>
</div>

        {/* Search Bar */}
  
        <div className="flex items-center ml-auto gap-2">



          {/* Search Bar */}
          <div className="flex items-center w-[400px] border border-cyan-600 dark:border-gray-200 rounded-full px-4 py-2 shadow-sm backdrop-blur-md">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-700 dark:placeholder-gray-200"
            />
            <FaSearch className="text-cyan-700 dark:text-gray-200 text-lg mr-2" />
          </div>

        </div>



      </div>

{/* DROPDOWN FILTER BOX */}
{showFilter && (
  <div
    ref={filterRef}
    className="absolute mt-2 w-64 bg-white dark:bg-cyan-950 rounded-xl shadow-xl border border-gray-200 dark:border-cyan-700 p-4 z-50">

    {/* STATUS HEADER */}
    <button
      onClick={() =>
        setOpenSection(openSection === "status" ? "" : "status")
      }
      className="w-full text-left px-3 py-2 font-semibold bg-gray-100 dark:bg-gray-600 text-balck dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg mb-2"
    >
      Status
    </button>

    {/* Specialization OPTIONS */}
    {openSection === "status" && (
      <div className="flex flex-col gap-2 mb-3">
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-3 py-2 rounded-lg text-sm ${
            statusFilter === "active"
              ? "bg-cyan-600 dark:bg-cyan-800 text-white"
              : "bg-gray-200 dark:bg-slate-500 text-black dark:text-white hover:bg-cyan-500 dark:hover:bg-cyan-700" 
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setStatusFilter("inactive")}
          className={`px-3 py-2 rounded-lg text-sm ${
            statusFilter === "inactive"
              ? "bg-cyan-600 dark:bg-cyan-800 text-white "
              : "bg-gray-200 dark:bg-slate-500 text-black dark:text-white hover:bg-cyan-500 dark:hover:bg-cyan-700"
          }`}
        >
          Inactive
        </button>
      </div>
    )}

{/* ROLE HEADER */}
    <button
      onClick={() =>
        setOpenSection(openSection === "specialization" ? "" : "specialization")
      }
      className="w-full text-left px-3 py-2 font-semibold bg-gray-100 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500  rounded-lg mb-2"
    >
      Specialization
    </button>

    {/* ROLE OPTIONS */}
    {openSection === "specialization" && (
  <div className="flex flex-col gap-2 mb-3">
    {DOCTOR_SPECIALIZATIONS.map((item) => (
      <button
        key={item.value}
        onClick={() => setspecializationFilter(item.label)}
        className={`px-3 py-2 rounded-lg text-sm capitalize ${
          specializationFilter === item.label
            ? "bg-cyan-600 dark:bg-cyan-800 text-white"
            : "bg-gray-200 dark:bg-slate-500 text-black dark:text-white hover:bg-cyan-500 dark:hover:bg-cyan-700"
        }`}
      >
        {item.label}
      </button>
    ))}
  </div>
)}

    {/* APPLY BUTTON (TOP) */}
    <button
      onClick={() => setShowFilter(false)}
      className="w-full py-2 bg-cyan-600 dark:bg-cyan-700 text-white rounded-lg mb-2 hover:bg-cyan-800 dark:hover:bg-cyan-500"
    >
      Apply Filters
    </button>

    {/* CLEAR BUTTON */}
    <button
      onClick={() => {
        setspecializationFilter("");
        setStatusFilter("");
      }}
      className="w-full py-2 bg-gray-200 dark:bg-slate-400 text-black dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-300"
    >
      Clear Filters
    </button>

  </div>
)}

      {/* Table */}

    <div className="bg-white rounded-2xl shadow-md">

  {/* SCROLL CONTAINER */}
  <div className="max-h-[450px] overflow-y-auto rounded-2xl">

    <table className="w-full text-left">

          {/* TABLE HEADER */}

          <thead className="bg-cyan-600 text-gray-100 text-sm sticky top-0 z-10">

            <tr className="divide-x divide-gray-100">

              <th style={{ width: columnWidths.appointment_id }} className="p-4 relative">
                Appointment No.
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_id")}
                />
              </th>

              <th style={{ width: columnWidths.patient_name }} className="p-4 relative">
                Patient Name
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "patient_name")}
                />
              </th>

              

              <th style={{ width: columnWidths.doctor_name }} className="p-4 relative">
                Doctor Name
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "doctor_name")}
                />
              </th>

              <th style={{ width: columnWidths.specialization }} className="p-4 relative">
                Specialization
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "specialization")}
                />
              </th>

              <th style={{ width: columnWidths.appointment_date }} className="p-4 relative">
                Appointment Date
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_date")}
                />
              </th>

              <th style={{ width: columnWidths.appointment_time }} className="p-4 relative">
                Appointment Time
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "appointment_time")}
                />
              </th>

              <th style={{ width: columnWidths.status }} className="p-4 relative">
                Status
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "status")}
                />
              </th>

              <th style={{ width: columnWidths.action }} className="p-4 relative">
                Action
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "action")}
                />
              </th>

            </tr>

          </thead>

            {/* Loading */}

            <tbody className="text-sm text-gray-700">

            {loading && (

              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>

            )}



            {/* No Data */}

            {!loading && filteredAppointments.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-500"
                >
                  No doctors found
                </td>

              </tr>

            )}



            {/* Rows */}

            {!loading &&
            filteredAppointments.map((app) => {
                  

                return (

                  <tr
                    key={app.appointment_id}
                    className={`border-b border-gray-300 items-center transition duration-200`}>
                  

<td className="p-4 "><div className="flex gap-2 justify-center items-center">
  {app.appointment_no || "-"}
  </div></td>


  <td className="p-4">
  <div className="flex justify-center items-center gap-3">

      {app.doctor_name}

  </div>
</td>


                 <td className="p-4 "><div className="flex gap-2 justify-center items-center"> {app.patient_name} </div></td>


                   <td className="p-4 "><div className="flex gap-2 justify-center items-center"> {app.specialization} </div></td>  

                    <td className="p-4"><div className="flex gap-2 justify-center items-center">
                      {app.appointment_date}
                    </div></td>

                    <td className="p-4 "><div className="flex gap-2 justify-center items-center">
                      {app.appointment_time || "-"} 
                      </div></td>


                      <td className="p-4 ">
                        <div className={`flex gap-2 justify-center items-center`}>
                          
                        {app.booking_status}
                        </div>
                        </td> 

                    <td className="p-4">

                      <div className="flex justify-center gap-4">

      <button
          onClick={() => {
                    navigate(`/admin/appointments/appointment_details/${app.appointment_id}`, { state: app });
                              }}
        type="button"
        className="text-blue-600 hover:text-blue-800"
        title="View Doctor"
      >
      
        <EyeIcon className="w-5 h-5" />

      </button>

  </div>

                    </td>

                  </tr>

                );

              })}

          </tbody>

        </table>

      </div>

      </div>

      </div>

    </div>

  );

};

export default AdminAppoinments;
