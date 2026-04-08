import {
  FaSearchPlus,
  FaUserMd,
  FaHeartbeat,
  FaCommentMedical,
  FaLightbulb,
  FaHandsHelping,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { forwardRef, useRef, useImperativeHandle } from "react";
import doctorPhone from "../../assets/doc_phone.png";
import Appointments from "../Patient/Appointments";

export type CardsRef = {
  scrollToBrowseSpecialty: () => void;
};

const Cards = forwardRef<CardsRef>((_, ref) => {
  const navigate = useNavigate();
  const browseSpecialtyRef = useRef<HTMLDivElement | null>(null);

  const scrollToBrowseSpecialty = () => {
    browseSpecialtyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useImperativeHandle(ref, () => ({
    scrollToBrowseSpecialty,
  }));

  return (
    <div className="bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
      <h1 className="text-6xl pt-7 font-bold text-center text-cyan-800 dark:text-gray-100 mb-3">
        Comprehensive Healthcare <br /> Features
      </h1>

      <p className="text-2xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-3">
        Everything you need for better health management in one intelligent platform
      </p>

      <div className="grid gap-8 md:grid-cols-3 p-8">
        {/* Card 1 */}
        <div
          className="group relative bg-gradient-to-r from-cyan-600 to-teal-200 shadow-lg rounded-xl p-8 h-70 w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          onClick={() => navigate("/patient/symptom_checker")}
        >
          <div>
            <div className="inline-flex items-center justify-center bg-cyan-50 border-blue-300 dark:bg-cyan-950 dark:border-blue-900 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaSearchPlus className="text-black dark:text-blue-50 text-4xl" />
            </div>
          </div>

          <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
            Smart Symptom Insights
          </h3>

          <p className="text-neutral-900 text-[17px]/7">
            Understand your symptoms with clear and structured health information using our AI-powered symptom checker.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative group rounded-xl cursor-pointer">
          <div className="bg-gradient-to-r from-emerald-200 to-cyan-700 shadow-lg rounded-xl p-8 h-70 w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <div className="inline-flex items-center justify-center bg-teal-50 border border-blue-300 dark:bg-cyan-950 dark:border-blue-900 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaHeartbeat className="text-cyan-950 dark:text-cyan-50 dark:bg-cyan-950 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Safe Remedies
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Discover trusted home remedies and natural health tips that help manage common issues while minimizing the risk of side effects.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="relative group rounded-xl cursor-pointer"
          onClick={scrollToBrowseSpecialty}
        >
          <div className="bg-gradient-to-r from-sky-200 to-teal-700 dark:bg-gray-800 shadow-lg rounded-xl p-8 h-70 w-full text-left transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <div className="inline-flex items-center justify-center bg-cyan-50 border-blue-300 dark:bg-cyan-950 border dark:border-blue-950 rounded-xl p-4 mb-4 transition-all duration-300 group-hover:scale-110">
              <FaUserMd className="text-emerald-950 dark:text-emerald-50 text-4xl" />
            </div>

            <h3 className="text-neutral-950 font-semibold text-3xl mb-3">
              Doctor Consultation
            </h3>

            <p className="text-neutral-900 text-[17px]/7">
              Connect with doctors when expert advice is needed, bridging basic health guidance with professional medical support.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Technology Section */}
      <div className="py-16 px-10 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <img
              src={doctorPhone}
              alt="Healthcare Technology"
              className="rounded-2xl shadow-lg w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-cyan-900 dark:text-gray-100 mb-6">
              Advanced Technology for Better Healthcare
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              SymptoNexus combines cutting-edge AI technology with medical expertise
              to provide you with the most accurate health assessments and
              personalized care recommendations.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaLightbulb className="text-cyan-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    24/7 Availability
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Access healthcare services anytime, anywhere.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaHandsHelping className="text-cyan-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Secure & Private
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your health data is encrypted and protected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaCommentMedical className="text-cyan-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Digital Health Records
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    All your medical records in one place.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-cyan-900 p-3 rounded-lg h-12">
                  <FaSearchPlus className="text-cyan-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Instant Results
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get quick symptom analysis and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How SymptoNexus Works */}
      <div className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="max-w-7xl mx-auto bg-cyan-50 dark:bg-gray-800 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center text-cyan-950 dark:text-white mb-14">
            How SymptoNexus Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                1. Describe Your Symptoms
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tell us how you're feeling to get personalized insights.
              </p>
            </div>

            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                2. Get Advice & Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Understand possible causes and recommended next steps.
              </p>
            </div>

            <div>
              <div className="text-6xl font-bold text-blue-300 mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                3. Connect With Doctors
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If needed, talk to a medical expert directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Specialty */}
      <div
        ref={browseSpecialtyRef}
        className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950"
      >
        <h2 className="text-6xl font-bold text-center text-cyan-900 dark:text-gray-100 mb-5">
          Browse by Specialty
        </h2>

        <p className="text-xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-7">
          Find the right specialist for your health needs from our diverse network of medical professionals
        </p>

        <div>
          <Appointments />
        </div>
      </div>

      <div className="py-16 px-8 bg-gradient-to-r from-gray-200 via-slate-50 to-gray-200 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <h2 className="text-6xl font-bold text-center text-cyan-900 dark:text-gray-100 mb-3">
          What Our Users Say
        </h2>

        <p className="text-xl pl-2 text-center text-gray-600 dark:text-gray-100 mb-3">
          Join thousands of satisfied users who trust SymptoNexus for their healthcare needs
        </p>
      </div>
    </div>
  );
});

export default Cards;