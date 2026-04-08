import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";
import { getSpecializationCountApi } from "../../../services/homepageCountApi";

import general from "../../../assets/general.png";
import cardiology from "../../../assets/cardiology.png";
import dermatology from "../../../assets/dermatology.png";
import pediatrics from "../../../assets/pediatrics.png";
import surgeon from "../../../assets/surgeon.png";
import dentist from "../../../assets/dentist.png";
import eye from "../../../assets/eye.png";
import ent from "../../../assets/ent.png";
import psychiatry from "../../../assets/psychiatry.png";
import neurology from "../../../assets/neurology.png";
import orthopedic from "../../../assets/orthopedic.png";
import gynecology from "../../../assets/gynecology.png";

const IMAGES: Record<number, string> = {
  1: general,
  2: cardiology,
  3: dermatology,
  4: pediatrics,
  5: surgeon,
  6: dentist,
  7: eye,
  8: ent,
  9: psychiatry,
  10: neurology,
  11: orthopedic,
  12: gynecology
};

const CARD_COLORS: Record<number, string> = {
  1: "bg-gradient-to-br from-gray-100 to-cyan-700",
  2: "bg-gradient-to-br from-sky-100 to-blue-400",
  3: "bg-gradient-to-br from-cyan-100 to-blue-500",
  4: "bg-gradient-to-br from-blue-100 to-blue-600",
  5: "bg-gradient-to-br from-blue-100 to-cyan-500",
  6: "bg-gradient-to-br from-cyan-100 to-blue-400",
  7: "bg-gradient-to-br from-blue-100 to-blue-700",
  8: "bg-gradient-to-br from-cyan-100 to-blue-600",
  9: "bg-gradient-to-br from-sky-100 to-cyan-500",
  10: "bg-gradient-to-br from-blue-100 to-sky-600",
  11: "bg-gradient-to-br from-cyan-100 to-blue-700",
  12: "bg-gradient-to-br from-blue-100 to-sky-500"
};

const DESC: Record<number, string> = {
  1: "General Health care",
  2: "Heart & Cardiovascular care",
  3: "Skin, Hair & Nail care",
  4: "Child & Adolescent healthcare",
  5: "Surgical Treatment & Procedures",
  6: "Teeth & Oral healthcare",
  7: "Vision & Eye care",
  8: "Ear, Nose & Throat care",
  9: "Mental Health & Behavior",
  10: "Brain & Nervous system",
  11: "Bones, Joints & Muscles",
  12: "Women’s Reproductive Health"
};

interface AppointmentsProps {
  showHeader?: boolean;
}


const Appointments: React.FC<AppointmentsProps> = ({ showHeader = true }) => {
  const [doctorCounts, setDoctorCounts] = useState<Record<number, number>>({});

  const navigate = useNavigate();
  const location = useLocation();

  const called = useRef(false);

  useEffect(() => {

    if (called.current) return;

    called.current = true;

    const fetchCounts = async () => {

      try {

        const data = await getSpecializationCountApi();

        const countMap: Record<number, number> = {};

        data.forEach((item) => {
          countMap[item.specialization_id] = item.doctor_count;
        });

        setDoctorCounts(countMap);

      } catch (error) {
        console.error("Error fetching specialization counts:", error);
      }

    };

    fetchCounts();

  }, []);
  return (
   <div
  className={`p-6 ${
    location.pathname === "/"
      ? "bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950"
      : "bg-gradient-to-r from-slate-300 via-gray-50 to-slate-300 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950"
  }`}>
      {/* Title */}
      {showHeader && location.pathname !== "/" && (
  <h2 className="text-3xl pt-5 font-bold text-cyan-900 mb-5">
    Browse by Specialties
  </h2>
)}
      {/* Grid */}
      <div className="
        grid
        grid-cols-2
        sm:grid-cols-4
        md:grid-cols-4
        lg:grid-cols-4
        gap-12
        pt-8
      ">
        {DOCTOR_SPECIALIZATIONS.map((item) => {
          const image = IMAGES[item.value];
          const color = CARD_COLORS[item.value];
          const desc = DESC[item.value];

          return (
            <div
              key={item.value}
              
              onClick={() =>
                  navigate(
                    location.pathname === "/"
                      ? `/doctors/${item.value}`
                      : `/patient/doctors/${item.value}`
                  )} 
              className={`
    flex items-center gap-3
    rounded-xl
    p-4
    ${color}
    hover:shadow-md
    transform transition-transform duration-300 ease-in-out hover:scale-103 dark:hover:scale-103
    cursor-pointer
  `}
            >
              {/* Image */}
              <div className="
                bg-gray-100
                p-3
                rounded-full
                w-22 h-22
                flex items-center justify-center
              ">
                <img
                  src={image}
                  alt={item.label}
                  className="w-20 h-20 object-contain"
                />
              </div>

              {/* Label */}
                <div className=" flex flex-col">
              <span className="font-medium text-gray-900 text-lg">
                {item.label}
              </span>
              
                {showHeader && location.pathname === "/" && (
                  <div className=" flex flex-col">
                  <span className="text-xs text-gray-800"> {desc} </span>
                  <span className="text-xs text-gray-700">
                      {doctorCounts[item.value] || 0}+ Doctors
                    </span>
                  </div>
                )}
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;