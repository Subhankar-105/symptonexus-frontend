import { FaCalendarAlt  } from 'react-icons/fa';
import {  MdPeople, MdEventAvailable, MdAddTask, MdCancel  } from 'react-icons/md';
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import type { RootState } from "../../../../store/store";
import { cancelAppointmentsApi } from "../../../services/appointmentApi";
import { getAcknowledgementApi } from "../../../services/acknoledgementPdf";
import dayjs from 'dayjs';
import { FaFilePrescription } from 'react-icons/fa6';
import { FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AppoinmentDetail = () => {

const { appointment_id } = useParams();
const location = useLocation();


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

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

const dob = appointment?.patient_dob || null;
  const age = dob ? dayjs().diff(dayjs(dob), "year") : null;

      if (!appointment) {
    return <div className="p-10">No appointment data found</div>;
  }

const STATUS_ORDER = [
  "Booking Initiated",
  "Booking Confirmed",
  "Slot Assigned",
  "Consultation Completed",
  "Prescription Generated",
];

const steps = [
  { label: "Booking Initiated", icon: <MdEventAvailable className="text-lg" /> },
  { label: "Booking Confirmed", icon: <MdAddTask className="text-lg" /> },
  { label: "Slot Assigned", icon: <FaCalendarAlt className="text-lg" /> },
  { label: "Consultation Completed", icon: <MdPeople className="text-lg" /> },
  { label: "Prescription Generated", icon: <FaFilePrescription className="text-lg" /> },
];

const REJECTION_FLOW: Record<string, number> = {
  "Booking Rejected": 0,
  "Canceled by Doctor": 2,
  "Canceled by Patient": 1,
};

const currentStatus = appointment.booking_status;
const isRejected = Object.prototype.hasOwnProperty.call(REJECTION_FLOW, currentStatus);
const rejectionIndex = isRejected ? REJECTION_FLOW[currentStatus] : -1;
const currentIndex = STATUS_ORDER.indexOf(currentStatus);


  const handleOpenCancelModal = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      setCancelLoading(true);

      const response = await cancelAppointmentsApi({
        appointment_id: selectedAppointmentId,
        action: "cancel",
      });

      if (response?.data?.success) {
        setShowModal(false);
        setSelectedAppointmentId(null);
      } else {
        toast(response?.data?.message || "Failed to cancel appointment");
      }
    } catch {

      toast("Something went wrong while cancelling appointment");
    } finally {
      setCancelLoading(false);
    }
  }
const handleDownloadPdf = async () => {
  try {
    const response = await getAcknowledgementApi({
      appointment_id: appointment.appointment_id,
      patient_id: appointment.patient_id
    });

    if (response.status === 200) {
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `acknowledgement_${appointment.appointment_id}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF successfully downloaded");
    } else {
      toast.error("Failed to download PDF");
    }
  } catch {
    toast.error("Something went wrong");
  }
};
  return (
     <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
        
              <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">Appointments Details</h2>
                <div className=" p-2 grid grid-cols-2 gap-4  ">
                    {(
                      appointment.booking_status === "Booking Initiated" || 
                      appointment.booking_status === "Booking Confirmed" ) && (
                      <button
                      
                        type="button"
                        onClick={() => handleOpenCancelModal(appointment.appointment_id)}
                        className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {(
                      appointment.booking_status === "Slot Assigned") && (
                      <button
                      onClick={handleDownloadPdf}
                        type="button"
                        className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                      >
                        Download Details as PDF
                      </button>
                    )}

                    {(
                      appointment.booking_status === "Prescription Generated") && (
                      <button

                        type="button"
                        className="text-xs p-2 w-full border border-red-50 text-red-500 dark:text-red-600 dark:bg-red-100 bg-red-100 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-300 transition"
                      >
                        Download Prescription as PDF
                      </button>
                    )}

                    </div>
                 </div>

     {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl shadow-xl p-6 w-[350px] text-center">

            {/* ICON */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-orange-300 flex items-center justify-center text-orange-400 text-3xl">
              !
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>

            {/* MESSAGE */}
            <p className="text-gray-600 mb-6">
              You want to cancel this appointment
            </p>

            {/* BUTTONS */}
            <div className="flex justify-center gap-3">

              {/* CONFIRM */}
              <button
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? "Cancelling..." : "Yes"}
              </button>

              {/* CANCEL */}
             <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointmentId(null);
                }}
                disabled={cancelLoading}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}




     <div className="grid grid-cols-2 gap-0 bg-white/20 backdrop-blur-md shadow-md w-full  p-4  rounded-lg">
     <div className="grid grid-cols-2 gap-0">

           
                {/* Status Tracker */}

                <div className="bg-white/20 h-164 w-70 backdrop-blur-md shadow-md rounded-lg">

                    <h2 className="pt-3 pl-5 text-xl font-bold text-blue-500">Status Tracker</h2>
 <div className="flex flex-col pt-2">
    {steps.map((step, index) => {
      if (isRejected && index > rejectionIndex) return null;

      const isDoneOrActive = isRejected ? index <= rejectionIndex : index <= currentIndex;
      const isLastVisible = isRejected
        ? index === rejectionIndex
        : index === steps.length - 1;

      return (
        <div key={step.label} className="flex">
          <div className="flex flex-col items-center ml-4  mr-3">
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isDoneOrActive
                  ? "bg-cyan-700 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.icon}
            </span>

            {!isLastVisible && (
              <span
                className={`w-1 h-10 mt-1 mb-1 rounded-full ${
                  isRejected
                    ? "bg-cyan-700"
                    : index < currentIndex
                    ? "bg-cyan-700"
                    : "bg-gray-300"
                }`}
              />
            )}

            {isRejected && index === rejectionIndex && (
              <span className="w-1 h-10 mt-1  rounded-full bg-red-500" />
            )}
          </div>

          <div className="pt-2">
            <span
              className={`text-[15px] font-semibold ${
                isDoneOrActive
                  ? "text-cyan-900 dark:text-white"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        </div>
      );
    })}

    {isRejected && (
      <div className="flex">
        <div className="flex flex-col items-center mr-3">
          <span className="flex items-center justify-center w-10 h-10 ml-4 mt-1 rounded-full bg-red-600 text-white text-xl">
            <MdCancel/>
          </span>
        </div>

        <div className="pt-2">
          <span className="text-[15px] font-semibold text-red-600">
            {currentStatus}
          </span>
        </div>
      </div>
    )}
  </div>

                    <div className="h-px w-60 bg-cyan-700  mt-3 ml-3 "></div>
                    <div className="mb-2 pl-4">
              <span className="text-cyan-600 text-sm font-semibold">
                Status: {appointment.booking_status}
              </span>
              <br />
              <span className="text-cyan-600 text-sm font-semibold">
                Created: {appointment.created_on}
              </span>
            </div>
            <div className="h-px w-60 bg-cyan-700 mt-1 ml-2 "> </div>
            <div>
              <h2 className="pt-3 pl-2 text-xl font-semibold">Clinic SymptoNexus</h2>
               
               <div className="mt-1 pl-2 ">

              <span className="text-sm  text-black dark:text-white">
               Krishnanagar, Nadia < br/> West Bengal - 741102
              </span>< br/>
              <span className="text-sm  text-black dark:text-white">
               Contact : +91 98765 43210 < br/> Email : symptonexus333@gmailcom
              </span>
              

            </div>

          </div>
              


          </div>
                 {/* Doctor Summary */}

            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg w-110 h-80">
            
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
                     <div className="bg-white/20 backdrop-blur-md shadow-md mt-4 rounded-lg w-110 h-80 ">
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
             

            </div>

            {/*Appoinment Details */}
            <div>
            <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg ml-40 w-108 h-80">

            <h2 className="text-2xl pl-5 pt-5 font-bold text-blue-500">Appointment Summary</h2>
                <div className=" pl-5 pt-4">

                 <span className="text-sm font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   ID: {appointment.appointment_no || "Not Generated"}
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Date: {appointment.appointment_date || "-"}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Time: {appointment.appointment_time || "-"}
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
                      <div className="bg-white/20 backdrop-blur-md shadow-md rounded-lg ml-40 mt-4 w-108 h-80 ">
                      <h2 className="pt-5 pl-5 text-2xl font-bold text-blue-500">Booking Details</h2>

                     <div className=" pl-5 pt-2">

                 <span className="text-lg font-semibold flex items-center pl-1 gap-2 text-black dark:text-white"> 
                   Booking Number : 
                  </span>

                     <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Date : {appointment.created_on}
                  </span>

                 <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Booking Time : {appointment.booking_time}
                  </span>

                    </div>
                    <div className="h-0.5 w-100 bg-cyan-700 ml-3 mt-10"></div>
                    <div className="ml-3 mt-4">
                   <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Reporting Time : 10:15 AM
                  </span>
                  <span className="font-sm flex items-center pl-1 gap-2  text-black dark:text-white"> 
                   Contact Name : {appointment.admin_name} < br/> Phone Number : {appointment.admin_phone} < br/>
                   Email : {appointment.admin_email}
                  </span>
                  </div>


                      </div>

                </div>

                {/* Instructions */}

                <div className="h-50 w-296 rounded-lg mt-4 bg-white/20 backdrop-blur-md shadow-md ">
                <h2 className="pt-3 pl-5 text-xl font-semibold text-blue-500">Notes & Instructions</h2>

              <div className="pl-5 gap-3 text-black dark:text-gray-50">
                <span className='flex items-center'> <FiChevronRight /> Please arrive at least 30 – 35 minutes before your scheduled appointment time to avoid delays. </span> 
                <span className='flex items-center'> <FiChevronRight /> Carry the ACKNOWLEDGEMENT (*Absolutely Necessary) and any previous medical records, prescriptions or test reports for better consultation. </span>
                <span className='flex items-center'> <FiChevronRight /> In case of any inability to attend, kindly cancel the appointment in advance. </span> 
                <span className='flex items-center'> <FiChevronRight /> Follow proper guidelines, including hygiene and safety protocols. </span> 
                <span className='flex items-center'> <FiChevronRight /> For follow-up consultations, ensure you mention previous visit details to the doctor. </span> 
                <span className='flex items-center'> <FiChevronRight /> For any assistance, contact support via the Contact section of our website. </span>
              </div>

                </div>

               
     </div>
     

    </div>
  )
}

export default AppoinmentDetail