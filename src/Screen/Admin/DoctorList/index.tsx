import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, PencilSquareIcon, AdjustmentsHorizontalIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FaSearch, FaEnvelope, FaUsersSlash, FaUserCheck, FaTrash, FaClock, FaIdCard } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchDoctorListThunk, setSelectedDoctor } from "../../../../store/slices/doctorSlice";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { deactiveDoctorApi } from "../../../services/doctorApi";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey = "doctor_no" | "name" | "email" | "phone_no" | "specialization" | "created_on" | "status" | "action";


/* ================= STATUS UI HELPER ================= */

type StatusUI = {
  label: string;
  className: string;
};

const getStatusLabel = (status?: string): StatusUI => {

  const normalized = status?.toLowerCase();

  switch (normalized) {

    case "active":
      return {
        label: "Active",
        className: " text-green-700 dark:text-green-700/70"
      };

    case "pending":
      return {
        label: "Pending",
        className: "text-amber-700 dark:text-amber-700/70"
      };

    case "rejected":
      return {
        label: "Rejected",
        className: "text-red-700 dark:text-red-700/70"
      };

      case "inactive":
      return {
        label: "Inactive",
        className: "text-gray-700 dark:text-gray-700/70"
      };

    default:
      return {
        label: status || "Unknown",
        className: "text-gray-700 dark:text-gray-700/70"
      };

  }

};

const ROW_COLORS = [
  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-400/60",
  "bg-gray-50 hover:bg-gray-200 dark:bg-gray-300/100"
];



const DoctorList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const { doctors, loading } = useSelector(
    (state: RootState) => state.doctor
  );


 

 const buttons = useSelector(
    (state: RootState) => state.auth.buttons
  );

  const canEdit = buttons?.some(
    (btn) => btn.control_key === "doctor edit"
  );

  const canView = buttons?.some(
    (btn) => btn.control_key === "doctor view"
  );

  const canDeleteProfile = buttons?.some(
    (btn) => btn.control_key === "delete doc account"
  );

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [specializationFilter, setspecializationFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [openSection, setOpenSection] = useState<"status" | "specialization" | "">("");
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");


  const handleDeactivateDoctor = async (doctorId: number) => {
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to deactivate this doctor",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel"
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const response = await deactiveDoctorApi({
        doctor_id: doctorId,
        status: "Inactive",
      });
  
      if (response?.data?.success) {
        toast.success("Doctor deactivated successfully ");
  
        dispatch(
  fetchDoctorListThunk({
    specializationId: undefined,
    isPatientRoute: true,
  })
);
      } else {
        toast.error(response?.data?.message || "Failed to deactivate");
      }
  
    } catch (error) {
      console.error("Deactivate doctor error:", error);
      toast.error("Something went wrong ");
    }
  };
  


    /* ================= COLUMN WIDTH STATE ================= */
  
    const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
      name: 250,
      email: 300,
      phone_no: 250,
      action: 150,
      specialization: 250,
      status: 150,
      doctor_no: 150,
      created_on: 200
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

  

  /* ================= FETCH DOCTORS ================= */
useEffect(() => {
  dispatch(
    fetchDoctorListThunk({
      specializationId: undefined,
      isPatientRoute: true,
    })
  );
}, [dispatch]);


  /* ================= FILTER DOCTORS ================= */

const filteredDoctors = (Array.isArray(doctors) ? doctors : [])
  .filter((doctors) => {
    const matchesStatus =
      !statusFilter ||
      doctors.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesRole =
      !specializationFilter ||
      doctors.specialization?.toLowerCase() === specializationFilter.toLowerCase();

    const matchesSearch =
      !search ||
      doctors.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      doctors.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      doctors.email?.toLowerCase().includes(search.toLowerCase()) ||
      doctors.specialization?.toLowerCase().includes(search.toLowerCase());
      doctors.status?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesRole && matchesSearch;
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
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Doctor List</h2>
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

        {/*Add Account + Search Bar */}
  
        <div className="flex items-center ml-auto gap-2">

          {/* Add Account */}
          <button
          onClick={() =>
             navigate("/admin/add_doctor")
              }
            className="flex items-center gap-1 px-3 py-2 border border-cyan-600 dark:border-gray-200 rounded-4xl
             backdrop-blur-md bg-white/10 shadow-sm hover:bg-cyan-100 dark:hover:bg-gray-400 transition"
          >
            <PlusIcon className="text-cyan-700 dark:text-gray-100 w-4 h-4" />
            <span className="text-sm flex items-center justify-center pr-2  text-cyan-700 dark:text-gray-100">
              Add
            </span>
          </button>

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

              <th style={{ width: columnWidths.doctor_no }} className="p-4 relative">
                Doctor ID
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "doctor_no")}
                />
              </th>

              <th style={{ width: columnWidths.name }} className="p-4 relative">
                Doctor Name
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "name")}
                />
              </th>

              

              <th style={{ width: columnWidths.email }} className="p-4 relative">
                Email
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "email")}
                />
              </th>

              <th style={{ width: columnWidths.phone_no }} className="p-4 relative">
                Phone Number
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "phone_no")}
                />
              </th>

              <th style={{ width: columnWidths.specialization }} className="p-4 relative">
                Specialization
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "specialization")}
                />
              </th>

              <th style={{ width: columnWidths.created_on }} className="p-4 relative">
                Joining Date
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "created_on")}
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

            {!loading && filteredDoctors.length === 0 && (

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
              filteredDoctors.map((doc, index) => {

                const statusUI =
                  getStatusLabel(doc.status);

                const color = ROW_COLORS[index % ROW_COLORS.length];  
                
                  

                return (

                  <tr
                    key={doc.doctor_id}
                    className={`border-b border-gray-300 items-center ${color} transition duration-200`}>
                  

<td className="p-4 "><div className="flex gap-2 justify items-center"><FaIdCard className="pt-1 text-2xl text-cyan-600 dark:text-cyan-700"/>{doc.doctor_no ?? "-"}</div></td>


  <td className="p-4">
  <div className="flex items-center gap-3">

    <div className="flex items-center justify-center w-11 h-11 rounded-full 
bg-cyan-600 dark:bg-cyan-700 text-white font-semibold shadow-sm cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103">
  {doc.first_name?.[0]}{doc.last_name?.[0]}
</div>

    <div>
      {doc.first_name} {doc.middle_name ?? ""} {doc.last_name}
    </div>

  </div>
</td>


                 <td className="p-4 "><div className="flex gap-2 justify items-center"><FaEnvelope className="pt-1 text-2xl text-cyan-600 dark:text-cyan-700"/>{doc.email ?? "-"}</div></td>


                   <td className="p-4 "><div className="flex gap-2 justify items-center"><FiPhone className="pt-1 text-xl text-cyan-600 dark:text-cyan-700"/>{doc.phone_no ?? "-"}</div></td>  

                    <td className="p-4"><div className="flex gap-2 justify items-center"><FaUserDoctor className=" text-sm text-cyan-600 dark:text-cyan-700"/>{doc.specialization ?? "-"}
                    </div></td>

                    <td className="p-4 "><div className="flex gap-2 justify items-center">
                      {doc.created_on ?? "-"}</div></td>


                      <td className="p-4 ">
                        <div className={`flex gap-2 justify items-center ${statusUI.className}`}>
                          
                        {doc.status === "Active" && (
                          <FaUserCheck className="text-green-500"/>
                        )} 
                        {doc.status === "Pending" && (
                          <FaClock className="text-amber-500"/>
                        )}
                       {doc.status === "Rejected" && (
                          <FaTrash className="text-red-500"/>
                        )}
                        {doc.status === "Inactive" && (
                          <FaUsersSlash className="text-gray-500"/>
                        )}

                        {doc.status?? "-"}
                        </div>
                        </td> 



                    <td className="p-4">

                      <div className="flex justify-center gap-4">

                      
    {/* VIEW */}
    
    {canView && (
      <button
      onClick={() => {
  dispatch(setSelectedDoctor(doc));
  navigate(`/admin/doctor_view_profile/${doc.doctor_id}`);
}}
        type="button"
        className="text-blue-600 hover:text-blue-800"
        title="View Doctor"
      >
        {doc.status === "Active" && (
      
        <EyeIcon className="w-5 h-5" />
)}

      </button>
    )}
    
    {/* EDIT */}
    {canEdit && (
      <button
        onClick={() => {
  dispatch(setSelectedDoctor(doc));
  navigate(`/admin/doctor_edit_profile/${doc.doctor_id}`);
}}
        type="button"
        className="text-gray-600 hover:text-gray-800"
        title="Edit Doctor"
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>
    )}

    {/* DELETE */}

    {canDeleteProfile && (
          <button
          onClick={() => handleDeactivateDoctor(doc.doctor_id)}
          type="button"
          className="  text-red-500 hover:text-red-800"
          title="Delete Doctor">  
            <TrashIcon 
            onClick={() => handleDeactivateDoctor(doc.doctor_id)}
            className="w-5 h-5"
            />
          </button>
            )}

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

export default DoctorList;
