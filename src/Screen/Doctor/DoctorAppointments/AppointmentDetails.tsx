import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../../../store/store";
import dayjs from 'dayjs';




const DocAppointmentDetails = () => {


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
                    <h2 className="text-4xl font-bold text-cyan-700 dark:text-gray-300">Appointments Details</h2>
                                        <button
                     
                      type="button"
                     
                      className="text-xs p-2 w-auto mt-2 border border-cyan-200 text-gray-700 dark:text-gray-200 dark:bg-cyan-700 bg-cyan-100 rounded-full font-semibold hover:bg-cyan-200 dark:hover:bg-cyan-500 transition"
                    >
                      
                      View Generated Prescriptions
                    </button>

                 </div>

     <div className=" bg-white/20 backdrop-blur-md shadow-md w-full  p-4  rounded-lg">


                        {/*Appoinment Details */}
            
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-auto h-auto ">

            <h2 className="text-3xl flex justify-center pt-5 font-bold text-blue-500">Appointment Summary</h2>
                <div className=" grid grid-cols-2 pl-10 pt-10">

                 <span className="text-lg font-semibold border flex items-center pl-1 gap-2 text-black dark:text-white"> 
                  Appointment ID : {appointment.appointment_no || "Not Generated"}
                  </span>

                     <span className="text-lg flex items-center border pl-1 gap-2  text-black dark:text-white"> 
                   Date : {appointment.appointment_date || "-"}
                  </span>

                 <span className="text-lg flex items-center border pl-1 gap-2  text-black dark:text-white"> 
                   Time : {appointment.appointment_time || "Not Generated"}
                  </span>

                <span className="text-lg flex items-center border pl-0.5 gap-2  text-black dark:text-white"> 
                  Status : {appointment.booking_status}
                  </span>

                <span className="text-lg flex items-center pl-0.5 gap-2 text-black dark:text-white"> 
                  Consultation : Follow-Up
                  </span>

                   <span className="text-lg flex items-center pl-0.5 gap-2  text-black dark:text-white"> 
                  Consultation Type : In-Person
                  </span>

                   <span className="text-lg flex items-center pl-0.5 gap-2 pb-5  text-black dark:text-white"> 
                  Consultation Reason : Symptoms
                  </span>

                  <span className="text-lg flex items-center pl-0.5 gap-2 pb-5 text-black dark:text-white"> 
                  Fees : {appointment.fees}
                  </span>

                      </div>



                      {/* Line Divider div */} 

                      <div className="bg-cyan-600 h-0.5 w-290 ml-3"></div>        

            
                       {/* Patient Details */}
                     
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

                 <span className="font-sm flex items-center pb-5 pl-0.5 gap-2  text-black dark:text-white"> 
                  Phone : {appointment.patient_phone}
                  </span>


                    </div>
                      </div>            





               
     </div>
     

    </div>
  )
}

export default DocAppointmentDetails;