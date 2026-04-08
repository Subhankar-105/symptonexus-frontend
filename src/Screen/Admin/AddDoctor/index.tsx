import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import background from "../../../assets/login_bg.png";
import dark_background from "../../../assets/dark_login_bg.png"

import type { AppDispatch } from "../../../../store/store";
import { createDoctorThunk } from "../../../../store/slices/doctorSlice";

import {
  isStrongPassword,
  isValidEmail,
  isValidPhone,
  doPasswordsMatch,
  getPasswordStrength,
  genderOption,
  DOCTOR_SPECIALIZATIONS
} from "../../../Environment";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const AddDoctor: React.FC = () => {

      const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
      ); 
  const dispatch = useDispatch<AppDispatch>();

        useEffect(() => {
          const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
          });
          observer.observe(document.documentElement, { attributes: true });
          return () => observer.disconnect();
        }, []);


  /* ================= STATE ================= */

  const [form, setForm] = useState({

    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    password: "",
    confirmPassword: ""

  });


  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= PASSWORD CHECK ================= */

  const passwordStrength = getPasswordStrength(form.password);

  const passwordsMatch =
    form.confirmPassword.length === 0 ||
    doPasswordsMatch(form.password, form.confirmPassword);


  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();


    if (!form.gender) {

      toast.error("Please select gender");
      return;

    }


    if (!form.specialization) {

      toast.error("Please select specialization");
      return;

    }

      if (!isValidEmail(form.email.trim())) {
      toast.error("Please select a valid email");
      return;
    }
    
    if (!isValidPhone(form.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }    


    if (!doPasswordsMatch(form.password, form.confirmPassword)) {

      toast.error("Passwords do not match");
      return;

    }


    if (!isStrongPassword(form.password)) {

      toast.error("Password is not strong enough");
      return;

    }


    const payload = {

  first_name: form.firstName,

  middle_name: form.middleName || undefined,

  last_name: form.lastName,

  email: form.email,

  phone_no: form.phone,

  gender: Number(form.gender),

  specialization: Number(form.specialization),

  password: form.password,

  confirm_password: form.confirmPassword

};

    setLoading(true);


    try {

      const result = await dispatch(createDoctorThunk(payload));


      if (createDoctorThunk.fulfilled.match(result)) {

        toast.success("Doctor created successfully and pending for approval");


        setForm({

          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          specialization: "",
          password: "",
          confirmPassword: ""

        });

      }
      else {

        toast.error(result.payload as string);

      }

    }
    catch {

      toast.error("Something went wrong");

    }
    finally {

      setLoading(false);

    }

  };


  /* ================= INPUT STYLE ================= */

  const inputClass =
    "w-full rounded-xl border border-gray-700 dark:border-gray-200 px-3 py-2 text-sm " +
    "focus:border-gray-700 dark:focus:border-gray-200 focus:ring-1 focus:ring-gray-700 dark:focus:ring-gray-200 outline-none placeholder:text-gray-800 dark:placeholder:text-gray-200";


  /* ================= UI ================= */

  return (

        <div className="min-h-[calc(100vh-110px)] bg-cover bg-center flex flex-col justify-start px-10 pt-10 py-10"
    style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}
    >
      <div className="w-full max-w-5xl p-10 pt-10 rounded-3xl relative backdrop-blur-xl mx-auto ">

  {/* top-left */}
  <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gray-400 dark:border-slate-200 rounded-tl-3xl"></span>

  {/* top-right */}
  <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gray-500 dark:border-slate-400 rounded-tr-3xl"></span>

  {/* bottom-left */}
  <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gray-400 dark:border-slate-300 rounded-bl-3xl"></span>

  {/* bottom-right */}
  <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gray-500 dark:border-slate-400 rounded-br-3xl"></span>

      <h2 className="text-3xl font-bold mb-6 text-cyan-700 dark:text-gray-200 text-center">
        Add Doctor
      </h2>


      <form onSubmit={handleSubmit} className="space-y-6">


        {/* PERSONAL */}

        

          

          <div className="grid grid-cols-3 gap-6 text-gray-700 dark:text-gray-100">

            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Name"
              required
            />


            <input
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Middle Name"
            />


            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Last Name"
              required
            />

          </div>

        


        {/* CONTACT */}

        

         

          <div className="grid grid-cols-2 gap-6 text-gray-700 dark:text-gray-100">

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Email"
              required
            />


            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="Phone Number"
              required
            />

          </div>

        


        {/* PROFESSIONAL */}

       

         

          <div className="grid grid-cols-2 gap-6 text-gray-700 dark:text-gray-100">


            {/* GENDER */}

           <select
  name="gender"
  value={form.gender}
  onChange={(e) =>
    setForm({
      ...form,
      gender: e.target.value
    })
  }
  className={inputClass}
  required
>
  <option className=" bg-white dark:bg-black text-black dark:text-white" value="">
    Select Gender
  </option>

  {genderOption.map((g) => (
    <option className=" bg-white dark:bg-black text-black dark:text-white" key={g.value} value={g.value}>
      {g.label}
    </option>
  ))}

</select>


            {/* SPECIALIZATION */}

            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
              required
            >

              <option className=" bg-white dark:bg-black text-black dark:text-white" value="">
                Select Specialization
              </option>

              {DOCTOR_SPECIALIZATIONS.map((spec) => (

                <option className=" bg-white dark:bg-black text-black dark:text-white" key={spec.value} value={spec.value}>

                  {spec.label}

                </option>

              ))}

            </select>


          </div>

        


        {/* SECURITY */}

        

          

          <div className="grid grid-cols-2 gap-6 text-gray-700 dark:text-gray-100">


            {/* PASSWORD */}

            <div>
            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Password"
                required
              />
             {/* Eye Icon */}
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute inset-y-0 right-3 flex items-center pb-0 text-gray-700 dark:text-gray-100"
               >
                 {showPassword ? (
                   <EyeIcon className="w-5 h-5" />
                 ) : (
                   <EyeSlashIcon className="w-5 h-5" />
                 )}
               </button>
              </div>

              {form.password && (

                <p className="text-sm mt-1 text-blue-600">

                  Strength: {passwordStrength}

                </p>

              )}

            </div>


            {/* CONFIRM PASSWORD */}

            <div>
              <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirm Password"
                required
              />
            {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center pb-0 text-gray-700 dark:text-gray-100"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {form.confirmPassword && !passwordsMatch && (

                <p className="text-red-600 text-sm mt-1">

                  Passwords do not match

                </p>

              )}


              {form.confirmPassword && passwordsMatch && (

                <p className="text-green-600 text-sm mt-1">

                  Passwords match

                </p>

              )}

            </div>


          </div>

        


        {/* SUBMIT */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-500 hover:from-cyan-900 hover:to-cyan-700 dark:from-cyan-900 dark:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-cyan-500 text-white rounded-md"
          >

            {loading ? "Creating..." : "Add Doctor"}

          </button>

        </div>


      </form>

      </div>

    </div>

  );

};


export default AddDoctor;
