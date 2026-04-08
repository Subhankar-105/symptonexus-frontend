import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideNav from "../Common/SideNav";
import DoctorProfile from "./Profile";


const Doctor = () => {
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);

  return (
    <div className="flex">
      <SideNav onProfileClick={() => setOpenProfileDrawer(true)}   />

      <main className="ml-64 w-screen">

         
      <DoctorProfile
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
      />
      
        <Outlet />
      </main>
     
    </div>
  );
};

export default Doctor;
