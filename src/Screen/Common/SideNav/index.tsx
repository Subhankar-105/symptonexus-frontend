import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { logout } from "../../../../store/slices/authSlice";
import { MENU_ROUTE_MAP, SIDE_NAV_CONTROLS, MENU_ICONS } from "../../../Environment";

interface SideNavProps {
  onProfileClick?: () => void;
}

interface Menu {
  control_master_id: number;
  control_key: string;
  control_name: string;
  control_type: string;
  control_desc: string | null;
  status: string;
}

const SideNav: React.FC<SideNavProps> = ({ onProfileClick }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [SelectRow, SetSelectedRow] = useState<string | null> (null);

  /* ================= REDUX ================= */

  const user = useSelector((state: RootState) => state.auth.user);
  const menus = useSelector((state: RootState) => state.auth.menus);
  const role = useSelector((state: RootState) => state.auth.role);

  /* ================= KEEP YOUR EXISTING LOGIC ================= */

  const normalizedRole = role?.toLowerCase();

  /* ================= ORDER MENUS ================= */

  const orderedMenus: Menu[] = SIDE_NAV_CONTROLS
    .map((key) => menus.find((menu) => menu.control_key === key))
    .filter((menu): menu is Menu => Boolean(menu));

  /* ================= INITIALS ================= */

  const firstLetter =
    user?.first_name?.charAt(0)?.toUpperCase() || "";

  const lastLetter =
    user?.last_name?.charAt(0)?.toUpperCase() || "";

  /* ================= PROFILE CLICK ================= */

  const handleProfileClick = () => {

    console.log("PROFILE CLICK", normalizedRole);

    if (!user) return;

    // PATIENT
    if (normalizedRole?.includes("patient")) {
      onProfileClick?.();
      return;
    }

    // ADMIN (super admin, standard admin, guest admin)
    if (normalizedRole?.includes("admin")) {
      onProfileClick?.();
      return;
    }

    if (normalizedRole?.includes("doctor")) {
      onProfileClick?.();
      return;
    }

  };

  /* ================= MENU CLICK ================= */

  const handleMenuClick = (controlKey: string) => {

    if (controlKey === "logout") {

      dispatch(logout());

      localStorage.clear();

      navigate("/registrationlogin/login");

      return;
    }

    const route = MENU_ROUTE_MAP[controlKey];

    if (route) {
      navigate(route);
    }

  };

  /* ================= UI ================= */

  return (
    <aside className="fixed top-16 bottom-12 left-0 w-64 bg-cyan-800 dark:bg-slate-700 text-white flex flex-col z-40">

      {/* PROFILE */}

      <div
        className="flex flex-col items-center py-6 cursor-pointer "
        onClick={handleProfileClick}
      >

<div className="w-16 h-16 rounded-full dark:bg-cyan-700 bg-cyan-600 flex items-center justify-center
text-xl font-bold mb-2 cursor-pointer
transform transition-transform duration-300 ease-in-out text-gray-200 dark:text-gray-100
hover:scale-103 dark:hover:scale-103 dark:hover:bg-cyan-700 hover:bg-cyan-600">

          {firstLetter}{lastLetter}

        </div>

        <p className="font-semibold text-center text-gray-100 dark:text-gray-50">

          {user?.first_name} {user?.last_name}

        </p>

        <p className="text-sm dark:text-gray-300 text-gray-200 text-center break-all px-2">

          {user?.email}

        </p>

        

      </div>

      <div className="bg-gradient-to-r from-sky-100 via-cyan-500 to-cyan-800 dark:from-slate-500 dark:via-cyan-900 dark:to-cyan-950 h-0.5 w-64"></div>

      {/* MENUS */}

      <ul className="flex-1 p-4 space-y-2">

        {orderedMenus.map((menu) => {

  const Icon = MENU_ICONS[menu.control_key];

  return (
    <li
      key={menu.control_master_id}
      onClick={() => {handleMenuClick(menu.control_key);
        SetSelectedRow(menu.control_key);
      }}
      className={` flex items-center gap-3 px-4 py-2 rounded cursor-pointer
transform transition-transform duration-300 ease-in-out 
hover:scale-103 text-gray-200 dark:text-gray-100 
${menu.control_key === "logout" ? " hover:bg-red-700" : "hover:bg-sky-600 dark:hover:bg-cyan-800  "}
${SelectRow === menu.control_key ? "bg-sky-700 dark:bg-gray-500" : " " } `}
    >
      {Icon && <Icon size={20} />}
      {menu.control_name}
    </li>
  );

})}

      </ul>

    </aside>
  );

};

export default SideNav;
