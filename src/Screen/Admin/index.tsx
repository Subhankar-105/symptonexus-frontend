import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideNav from "../Common/SideNav";
import AdminProfile from "./Profile";

const Admin = () => {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);


  return (
    <div className="flex">
      
      <main className="ml-64 w-screen">
        <SideNav onProfileClick={() => setOpenProfileDrawer(true)} />

        {/* RIGHT DRAWER */}
      <AdminProfile
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
      />

      
        <Outlet />

      </main>

      
    </div>
  );
};

export default Admin;
