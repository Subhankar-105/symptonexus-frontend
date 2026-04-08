import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { logout, loginSuccess } from "../store/slices/authSlice";
import { isTokenExpired } from "./utils/jwt";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Header from "./Screen/Common/Header";
import Footer from "./Screen/Common/Footer";

import HomePage from "./Screen/Homepage";
import About from "./Screen/Homepage/About";
import Privacy from "./Screen/Homepage/Privacy";
import Contact from "./Screen/Homepage/Contact";
import FAQ from "./Screen/Homepage/FAQs";
import ApplyDoctor from "./Screen/Homepage/DoctorApply";
import ApplicationSubmitted from "./Screen/Homepage/DoctorApply/Response";

import RegistrationLogin from "./Screen/RegistrationLogin";
import Login from "./Screen/RegistrationLogin/Login";
import Signup from "./Screen/RegistrationLogin/Signup";

import Patient from "./Screen/Patient";
import Patientpage from "./Screen/Patient/Dashboard";
import Profile from "./Screen/Patient/Profile";
import Feedback from "./Screen/Patient/Feedback";
import SymptoChecker from "./Screen/Patient/SymptoChecker";
import Appointments from "./Screen/Patient/Appointments";

import Admin from "./Screen/Admin";
import PrivateRoute from "./Screen/Common/Route/PrivateRoute";
import CreateAdmin from "./Screen/Admin/Create Admin";
import AdminList from "./Screen/Admin/AdminList";
import AdminDashboard from "./Screen/Admin/Dashboard";
import PendingDoctorlist from "./Screen/Admin/PendingDoctorlist";
import DoctorList from "./Screen/Admin/DoctorList";
import AddDoctor from "./Screen/Admin/AddDoctor";
import Messages from "./Screen/Admin/Messages";
import Doctor from "./Screen/Doctor";
import DoctorDashbord from "./Screen/Doctor/Dashbord";
import DoctorAppointments from "./Screen/Doctor/DoctorAppointments";
import AppointmentRequests from "./Screen/Doctor/AppointmentRequests";
import DoctorFeedback from "./Screen/Doctor/Feedback";
import DoctorEditProfile from "./Screen/Admin/DoctorProfile/DoctorEditProfile";
import DoctorViewProfile from "./Screen/Admin/DoctorProfile/DoctorViewProfile";
import SpDoctorList from "./Screen/Patient/Appointments/DoctorList";
import AdminProfileView from "./Screen/Admin/AdminProfile/AdminViewProfile";
import AdminEditProfile from "./Screen/Admin/AdminProfile/AdminEditProfile";
import SlotAvailability from "./Screen/Admin/SlotAvailability";
import Forgotpassword from "./Screen/RegistrationLogin/Forget_password";
import MyAppointments from "./Screen/Patient/MyAppoinments";
import PendingAppoinments from "./Screen/Admin/PendingAppoinments";
import AdminAppoinments from "./Screen/Admin/Appoinments";
import Slotmanagement from "./Screen/Admin/SlotManagament";
import AppointmentDetail from "./Screen/Patient/MyAppoinments/AppoinmentDetail";
import AppointmentDetails from "./Screen/Admin/Appoinments/AppointmentDetails";
import DocAppointmentDetails from "./Screen/Doctor/DoctorAppointments/AppointmentDetails";

/* ================= LAYOUT (SAFE PLACE FOR useLocation) ================= */

const AppLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();



  /* ---------- AUTH BOOTSTRAP ---------- */
  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const profile = localStorage.getItem("profile");
  const role = localStorage.getItem("role");
  const menus = localStorage.getItem("menus");
  const buttons = localStorage.getItem("buttons");

  if (!token || !user || !role || user === "undefined") {
    dispatch(logout());
    return;
  }

  if (isTokenExpired(token)) {
    localStorage.clear();
    dispatch(logout());
    return;
  }

  try {
    const parsedUser = JSON.parse(user);

    const parsedProfile =
      profile && profile !== "undefined" ? JSON.parse(profile) : null;

    const parsedMenus =
      menus && menus !== "undefined" ? JSON.parse(menus) : [];

    const parsedButtons =
      buttons && buttons !== "undefined" ? JSON.parse(buttons) : [];

    dispatch(
      loginSuccess({
        token,
        user: parsedUser,
        profile: parsedProfile,
        role,
        menus: parsedMenus,
        buttons: parsedButtons,
      })
    );
  } catch (error) {
    console.error("JSON parse error:", error);

    // important: clear bad data
    localStorage.clear();

    dispatch(logout());
  }
}, [dispatch]);

  /* ---------- AUTO LOGOUT ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.clear();
        dispatch(logout());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

      <Header />

      {/* CONTENT AREA */}
      <div className= " pt-16 pb-12 h-full flex">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/apply_doctor" element={<ApplyDoctor />} />
            <Route path="/apply_doctor/response" element={<ApplicationSubmitted />} />
            <Route path="doctors/:specializationId" element={<SpDoctorList />} />

            <Route path="/registrationlogin" element={<RegistrationLogin />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<Forgotpassword/>} />
            </Route>

            {/* PATIENT */}
            <Route
              path="/patient"
              element={
                <PrivateRoute allowedRoles={["patient"]}>
                  <Patient />
                </PrivateRoute>
              }
            >
              <Route index element={<Patientpage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="symptom_checker" element={<SymptoChecker/>} />
              <Route path="my_appointments" element={<MyAppointments />} />
              <Route path="my_appointments/booking_details/:appointmentId" element={<AppointmentDetail />} />
              
              <Route path="appointments" element={<Appointments/>} />
              <Route path="doctors/:specializationId" element={<SpDoctorList />} />
              
            </Route>

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <Admin />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="create_admin" element={<CreateAdmin />} />
              <Route path="admin_list" element={<AdminList/>} />
              <Route path="pending_doctor_list" element={<PendingDoctorlist/>} />
              <Route path="doctor_list" element={<DoctorList/>} />
              <Route path="messages" element={<Messages/>} />
              <Route path="add_doctor" element={<AddDoctor/>} />
              <Route path="pending_appointment" element= {<PendingAppoinments/>} />
              <Route path="appointments" element= {<AdminAppoinments/>} />
              <Route path="appointments/appointment_details/:appointmentId" element= {<AppointmentDetails/>} />
              <Route path="slot_availability"element= {<SlotAvailability/>} />
              <Route path="slot_management" element= {<Slotmanagement/>} />
              <Route path="doctor_view_profile/:doctorId" element={<DoctorViewProfile />} />
              <Route path="doctor_edit_profile/:doctorId" element={<DoctorEditProfile/>} />
              <Route path="admin_view_profile/:id" element={<AdminProfileView />} />
              <Route path="admin_edit_profile/:id" element={<AdminEditProfile/>}/>
            </Route>

            {/* Doctor */}
            <Route
              path="/doctor"
              element={
                <PrivateRoute allowedRoles={["doctor"]}>
                  <Doctor/>
                </PrivateRoute>
              }
            >
              <Route index element={< DoctorDashbord/>} />
              <Route path="appointments" element={<DoctorAppointments/>} />
              <Route path="appointments/appointment_details/:appointmentId" element={<DocAppointmentDetails/>} />
              <Route path="appointment_requests" element={<AppointmentRequests/>} />
              <Route path="doctor_feedback" element={<DoctorFeedback />} />
            </Route>

          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

/* ================= ROOT ================= */

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;


  {/* {
    !!user  &&UserActivation.user_type == 3 &&
        <Route path="/patient" element={<Patient />}>
  <Route index element={<Patientpage />} />
  <Route path="profile" element={<Profile />} />
  <Route path="profile_edit" element={<PatientProfileView />} />
  <Route path="feedback" element={<Feedback />} />
  } */}