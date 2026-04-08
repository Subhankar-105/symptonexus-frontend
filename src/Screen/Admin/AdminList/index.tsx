
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  EyeIcon, PencilSquareIcon, TrashIcon, AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FaSearch, FaEnvelope, FaUser, FaUserCheck, FaUsersSlash, FaRegCalendar } from "react-icons/fa";
import { HiArrowsUpDown } from "react-icons/hi2";
import { fetchAllAdmins } from "../../../../store/slices/adminSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import { deactiveAdminApi } from "../../../services/createAdminApi";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =  "name" | "email" | "role" | "action" | "created_on" | "department_id" | "status";

/* ================= ROLE UI TYPE ================= */

type AdminRoleUI = {
  label: string;
  className: string;
};



const getAdminTypeLabel = (role?: string): AdminRoleUI => {
  const normalized = role?.toLowerCase();

  switch (normalized) {
    case "super admin":
      return { label: "Super Admin", className: "bg-purple-100 dark:bg-purple-100/50 text-purple-700 dark:text-purple-700/70" };
    case "standard admin":
      return { label: "Standard Admin", className: "bg-blue-100 dark:bg-blue-100/50 text-blue-700 dark:text-blue-700/70" };
    case "guest admin":
      return { label: "Guest Admin", className: "bg-lime-100 dark:bg-lime-100/50 text-lime-700 dark:text-lime-700/70" };
    default:
      return { label: role || "Unknown", className: "bg-red-100 dark:bg-red-100/50 text-red-700 dark:text-red-700/70" };
  }
};

const ROW_COLORS = [
  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-400/60",
  "bg-gray-50 hover:bg-gray-200 dark:bg-gray-300/100"
];

const getDepartments = (value?: number) => {
  const found = DOCTOR_SPECIALIZATIONS.find(
    item => item.value === value
  );

  return {
    value: value ?? 0,
    department: found?.department || "__"
  };
};

const ROLE_COLORS: Record<string, string> = {
  "super admin": "text-purple-700",
  "standard admin": "text-blue-700",
  "guest admin": "text-green-700"
};
const AdminList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  

  const { admins, loading } = useSelector(
    (state: RootState) => state.admin
  );

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("");
const [statusFilter, setStatusFilter] = useState<string>("");
const [openSection, setOpenSection] = useState<"status" | "role" | "">("");
const filterRef = useRef<HTMLDivElement | null>(null);
const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

const handleDeactivateAdmin = async (adminUserId: number) => {

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You want to deactivate this admin",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, deactivate",
    cancelButtonText: "Cancel"
  });

  if (!result.isConfirmed) return;

  try {
    const response = await deactiveAdminApi({
      admin_user_id: adminUserId,
      status: "Inactive",
    });

    if (response?.data?.success) {
      toast.success("Admin deactivated successfully ");

      dispatch(fetchAllAdmins());
    } else {
      toast.error(response?.data?.message || "Failed to deactivate");
    }

  } catch (error) {
    console.error("Deactivate admin error:", error);
    toast.error("Something went wrong ");
  }
};

  /* ================= COLUMN WIDTH STATE ================= */

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
    name: 250,
    email: 300,
    role: 250,
    action: 150,
    created_on: 250,
    department_id: 300,
    status: 150
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

  /* ================= FETCH ADMINS ================= */

  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  /* ================= FILTER ADMINS ================= */

const filteredAdmins = (Array.isArray(admins) ? admins : [])
  .filter((admin) => {
    const matchesStatus =
      !statusFilter ||
      admin.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesRole =
      !roleFilter ||
      admin.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesSearch =
      !search ||
      admin.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      admin.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      admin.email?.toLowerCase().includes(search.toLowerCase()) ||
      admin.role?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesRole && matchesSearch;
  })
  .sort((a, b) => {
    const dateA = a.created_on ? new Date(a.created_on).getTime() : 0;
    const dateB = b.created_on ? new Date(b.created_on).getTime() : 0;

    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });



  return (
    <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Admin List</h2>
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
             navigate("/admin/create_admin")
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
<div className="flex items-center w-[400px] border border-cyan-500 dark:border-gray-600 rounded-full px-4 py-2 bg-white/10 dark:bg-gray-800/70 backdrop-blur-md shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
  
  <input
    type="text"
    placeholder="Search by name, email, or role..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
  />

  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white">
    <FaSearch className="text-sm" />
  </div>

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

    {/* STATUS OPTIONS */}
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
        setOpenSection(openSection === "role" ? "" : "role")
      }
      className="w-full text-left px-3 py-2 font-semibold bg-gray-100 dark:bg-gray-600 text-balck dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500  rounded-lg mb-2"
    >
      Role
    </button>

    {/* ROLE OPTIONS */}
    {openSection === "role" && (
      <div className="flex flex-col gap-2 mb-3">
        {["super admin", "standard admin", "guest admin"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-2 rounded-lg text-sm capitalize ${
              roleFilter === role
                ? "bg-cyan-600 dark:bg-cyan-800 text-white"
                : "bg-gray-200 dark:bg-slate-500 text-black dark:text-white hover:bg-cyan-500 dark:hover:bg-cyan-700"
            }`}
          >
            {role}
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
        setRoleFilter("");
        setStatusFilter("");
      }}
      className="w-full py-2 bg-gray-200 dark:bg-slate-400 text-black dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-300"
    >
      Clear Filters
    </button>

  </div>
)}
{/* TABLE */}

        <div className="bg-white rounded-2xl shadow-md">

          {/* SCROLL CONTAINER */}
  <div className="max-h-[450px] overflow-y-auto rounded-2xl">

  <table className="w-full text-left">
          {/* TABLE HEADER */}
          <thead className="bg-cyan-600 dark:bg-cyan-700  text-gray-100 text-sm sticky top-0 z-10">
            <tr className="divide-x divide-gray-100 dark:divide-gray-400">

              <th style={{ width: columnWidths.name }} className="p-4 relative">
                Name
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

              <th style={{ width: columnWidths.role }} className="p-4 relative">
                Role
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.created_on }} className="p-4 relative">
                Joining Date
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.department_id }} className="p-4 relative">
                Departments
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th style={{ width: columnWidths.status }} className="p-4 relative">
                Status
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "role")}
                />
              </th>

              <th
                style={{ width: columnWidths.action }}
                className="p-4 relative text-center"
              >
                Action
                <div
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => startResize(e, "action")}
                />
              </th>

            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="text-sm text-gray-700">

            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            )}

            {!loading &&
              filteredAdmins.map((admin, index) => {
                const role = getAdminTypeLabel(admin.role);
                const color = ROW_COLORS[index % ROW_COLORS.length];
                const roleKey = admin.role?.toLowerCase() || "";
                const roleColor = ROLE_COLORS[roleKey] || "text-gray-700";

                return (
                  <tr
                    key={admin.admin_user_id}
                    className={`border-b border-gray-300 items-center ${color} transition duration-200`}>
                  
              <td className="p-4">
  <div className="flex items-center gap-3">

    <div className="flex items-center justify-center w-11 h-11 rounded-full 
bg-cyan-600 dark:bg-cyan-700 text-white font-semibold shadow-sm cursor-pointer
                            transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103">
  {admin.first_name?.[0]}{admin.last_name?.[0]}
</div>

    <div>
      {admin.first_name} {admin.middle_name ?? ""} {admin.last_name}
    </div>

  </div>
</td>
                    <td className="p-4 "><div className="flex gap-2 justify items-center"><FaEnvelope className="pt-1 text-2xl text-cyan-600 dark:text-cyan-700"/>{admin.email ?? "-"}</div></td>

                    <td className="p-4">
                      <div className="flex gap-2 justify items-center" >
                        <FaUser className = {`${roleColor} pt-1 text-xl`}/>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${role.className}`}
                      >
                        
                        {role.label}
                      </span>
                      </div>
                    </td>

                    <td className="p-4 "><div className="flex gap-2 justify items-center"><FaRegCalendar className="text-cyan-500"/>{admin.created_on ?? "-"}</div></td>
                      
<td className="flex items-center justify-center pt-5">
  
  {admin.department_id?.length
    ? admin.department_id
        .map((id: number) => getDepartments(id).department)
        .join(", ")
    : "__"}
</td>

                      <td className="p-4 ">
                        <div className="flex gap-2 justify items-center">
                       {admin.status !== "Active" ? (
                          <FaUsersSlash className="text-red-500" />
                          ) : (
                          <FaUserCheck className="text-green-500" />
                        )}
                        {admin.status?? "-"}
                        </div>
                        </td> 

                    
                      <td className="p-4 flex justify-center gap-3 items-center">
                        <div className=" flex justify-center items-center gap-3 pt-3">
                      <EyeIcon
                          onClick={() =>
                          navigate(`/admin/admin_view_profile/${admin.admin_user_id}`, {
                          state: admin
                          })
                        }
                  className="w-5 h-5 text-blue-500 cursor-pointer"/>

                        <PencilSquareIcon
                          onClick={() =>
                            navigate(`/admin/admin_edit_profile/${admin.admin_user_id}`, { state: admin })
                          }
                          className="w-5 h-5 text-gray-500 cursor-pointer"
                        />

                        {admin.role?.toLowerCase() !== "super admin" && admin.status === "Active" && (
                        <TrashIcon
                            onClick={() => handleDeactivateAdmin(admin.admin_user_id)}
                            className="w-5 h-5 text-red-500 cursor-pointer"
                        />
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

export default AdminList;
