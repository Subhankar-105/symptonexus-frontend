
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../../../store/store";
import dayjs from 'dayjs';
import { Select, MenuItem } from "@mui/material";



const AppointmentDetail = () => {


const { appointment_id } = useParams();
const location = useLocation();
const user = useSelector((state: RootState) => state.auth.user);


const appointmentFromState = location.state;
const appointmentFromStore = useSelector(
  (state: RootState) => state.appointment.appointments
);

const appointment = useMemo(() => {
  return (
    appointmentFromStore.find(
      (a) => a.appointment_id === Number(appointment_id)
    ) || appointmentFromState
  );
}, [appointmentFromStore, appointmentFromState, appointment_id])

const dob = appointment?.patient_dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

      if (!appointment) {
    return <div className="p-10">No appointment data found</div>;
  }






  return (
     <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
        
              <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appointments Details</h2>

                 </div>

     <div className="grid grid-cols-2 gap-5 bg-white/20 backdrop-blur-md shadow-md w-full  p-4  rounded-lg">
                 {/* Doctor Summary */}

            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-auto h-80">
            
                <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Doctor Summary</h2>
                <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Name : {appointment.doctor_name}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Specialization : {appointment.specialization}
                  </span>

                   <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Bio : {appointment.doctor_bio}
                  </span>

                    <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Phone : {appointment.doctor_phone}
                  </span>

                    <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   License Number : {appointment.license_number}
                  </span>

                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                  Slot Time : {appointment.doc_slot}
                  </span>

              <span className="font-sm flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                   Experience : {Number(appointment.experience) === 0
                        ? "Fresher"
                        : `${Number(appointment.experience)}+ year${
                            Number(appointment.experience) > 1 ? "s" : ""
                          }`}
                  </span>



                <span className="font-sm flex items-center pl-0.5 gap-2  pb-2 text-black dark:text-white"> 
                   Fees : {appointment.fees}
                  </span>
                      </div>
                    </div>

                       {/* Patient Details */}
                     <div className="bg-white/20 backdrop-blur-md shadow-md mt-4 rounded-lg w-auto h-80 ">
                     <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Patient Details</h2>

                    <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Name : {appointment.patient_name}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Gender : {appointment.patient_gender}
                  </span>

                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   DOB : {appointment.patient_dob}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Age : {age}
                  </span>

                 <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Phone : {appointment.patient_phone}
                  </span>


                    </div>
                      </div>
            </div>
             

            

            {/*Appoinment Details */}
            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-auto h-80">

            <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Appointment Summary</h2>
                <div className=" pl-5 pt-4">

                 <span className="text-sm font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   ID: {appointment.appointment_no || "Not Generated"}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Date: {appointment.appointment_date || "-"}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Time: {appointment.appointment_time || "Not Generated"}
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Status: {appointment.booking_status}
                  </span>

                <span className="font-sm flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                  Consultation: Follow-Up
                  </span>

                   <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Type: In-Person
                  </span>

                   <span className="font-sm flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Reason: Symptoms
                  </span>

                      </div>
                            </div>

                        {/* Booking Details */}
                      <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg mt-4 w-auto h-80 ">
                      <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Booking Details</h2>

                     <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Booking Number : {appointment.booking_no}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Date : {appointment.created_on}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Time : {appointment.booking_time}
                  </span>

                    </div>
                   
                   {user?.role?.toLowerCase() === "standard admin" &&
                    appointment?.booking_status?.toLowerCase() === "booking confirmed" && (
                  <>
                    <div className="h-0.5 w-138 bg-cyan-700 ml-3 mt-10"></div>

                    <div>
                      <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-5 pl-5">
                        Consultation Status
                      </h1>

                      <Select
                        size="small"
                        className="h-10.5 mt-0.5 w-138 ml-4"
                      >
                        <MenuItem value="">Status</MenuItem>

                        <MenuItem value="Completed">
                          Consultation Completed
                        </MenuItem>

                        <MenuItem value="Missed">
                          Consultation Missed
                        </MenuItem>
                      </Select>
                    </div>
                  </>
                )}


                      </div>

                </div>

               
     </div>
     

    </div>
  )
}

export default AppointmentDetail