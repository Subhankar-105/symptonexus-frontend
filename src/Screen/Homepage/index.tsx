import Cards, { type CardsRef } from "./Cards";
import logo from "../../assets/logo_2.0.png";
import new_background from "../../assets/new_background.png";
import { FiArrowRight, FiUsers, FiAward, FiShield, FiClock } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { getDashboardCountApi } from "../../services/homepageCountApi";

const HomePage: React.FC = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);

  const hasFetched = useRef(false);
  const cardsRef = useRef<CardsRef | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchCounts = async () => {
      try {
        const data = await getDashboardCountApi();
        setPatientCount(data.patientCount);
        setDoctorCount(data.doctorCount);
      } catch (error) {
        console.error("COUNT FETCH ERROR:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleBookAppointmentClick = () => {
    cardsRef.current?.scrollToBrowseSpecialty();
  };

  return (
    <div className="pt-0">
      <div
        className="min-h-screen bg-cover bg-center items-center flex-col justify-center px-20 pt-35 py-10"
        style={{ backgroundImage: `url(${new_background})` }}
      >
        <div className="flex justify-between pb-10">
          {/* Left Side Text */}
          <div className="max-w-xl pt-0 pl-5">
            <h1 className="text-6xl font-semibold text-cyan-900">
              Your <br /> Symptoms, Our
              <br />
              <span className="text-sky-700 font-bold"> Responsibility</span>
            </h1>

            <p className="mt-6 font-bold text-cyan-950">
              Think of SymptoNexus as your first step to understanding <br /> and relief.
              We provide helpful knowledge and connect you with doctors,
              but never replace professional medical care or medication.
            </p>
          </div>

          {/* Right Side Image */}
          <div className="flex justify-end pr-140px pt-10 text-6xl">
            <img src={logo} alt="Logo" className="w-50 h-50" />

            <div>
              <p className="text-sky-900 text-6xl font-sans pt-10">
                SYMPTONEXUS
              </p>
              <p className="text-sky-800 text-2xl font-bold pt-5">
                From Symptoms to Smarter Care
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-130 h-auto mb-10">
          <button
            className="flex items-center gap-2 w-55 px-2 pr-5 mt-6 ml-5 h-11 rounded-lg font-semibold text-white 
              bg-linear-to-r from-sky-600 to-cyan-800 hover:from-sky-700 hover:to-cyan-900 
              dark:from-sky-800 dark:to-cyan-950
              dark:hover:from-sky-700 dark:hover:to-cyan-800
              transition-all"
          >
            <FiArrowRight />
            <span>Check Symptoms Now</span>
          </button>

          <button
            onClick={handleBookAppointmentClick}
            className="flex items-center gap-2 w-50 px-2 pr-5 mt-6 ml-5 h-11 rounded-lg font-semibold text-white 
              bg-linear-to-r from-sky-600 to-cyan-800 hover:from-sky-700 hover:to-cyan-900 
              dark:from-sky-800 dark:to-cyan-950
              dark:hover:from-sky-700 dark:hover:to-cyan-800
              transition-all"
          >
            <FiArrowRight />
            <span>Book Appoinment</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-20 ">
          <div>
            <div className="bg-cyan-600 dark:bg-cyan-900 w-16 h-16 mt-10 flex items-center justify-center rounded-xl mx-auto ">
              <FiUsers className="text-cyan-950 dark:text-gray-300 text-3xl" />
            </div>

            <h2 className="text-gray-900 text-2xl font-bold flex items-center justify-center ">
              {patientCount}+
            </h2>

            <p className="text-gray-800 flex items-center justify-center">Patient Served</p>
          </div>

          <div>
            <div className="bg-cyan-600 dark:bg-cyan-900 w-16 h-16 mt-10 flex items-center justify-center rounded-xl mx-auto">
              <FiAward className="text-cyan-950 dark:text-gray-300 text-3xl" />
            </div>

            <h2 className="text-gray-900 text-2xl font-bold flex items-center justify-center ">
              {doctorCount}+
            </h2>

            <p className="text-gray-800 flex items-center justify-center">Certified Doctors</p>
          </div>

          <div>
            <div className="bg-cyan-600 dark:bg-cyan-900 w-16 h-16 mt-10 flex items-center justify-center rounded-xl mx-auto">
              <FiShield className="text-cyan-950 dark:text-gray-300 text-3xl" />
            </div>

            <h2 className="text-gray-900 text-2xl font-bold flex items-center justify-center ">
              100%
            </h2>

            <p className="text-gray-800 flex items-center justify-center">Secure & Private</p>
          </div>

          <div>
            <div className="bg-cyan-600 dark:bg-cyan-900 w-16 h-16 mt-10 flex items-center justify-center rounded-xl mx-auto">
              <FiClock className="text-cyan-950 dark:text-gray-300 text-3xl" />
            </div>

            <h2 className="text-gray-900 text-2xl font-bold flex items-center justify-center ">
              24/7
            </h2>

            <p className="text-gray-800 flex items-center justify-center">Available Support</p>
          </div>
        </div>
      </div>

      <div>
        <Cards ref={cardsRef} />
      </div>
    </div>
  );
};

export default HomePage;