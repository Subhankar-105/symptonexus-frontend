import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { createAdminApi } from "../../../services/createAdminApi";
import { addAdmin } from "../../../../store/slices/adminSlice";
import background from "../../../assets/login_bg.png";
import dark_background from "../../../assets/dark_login_bg.png";


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

const CreateAdmin = () => {
    
    const [isDark, setIsDark] = useState(
      document.documentElement.classList.contains("dark")
    ); 

      useEffect(() => {
        const observer = new MutationObserver(() => {
          setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
      }, []);

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    adminType: "",
    department: [] as number[],
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* KEEP password strength */
  const passwordStrength = getPasswordStrength(form.password);

  const passwordsMatch =
    form.confirmPassword.length === 0 ||
    doPasswordsMatch(form.password, form.confirmPassword);

  /* dropdown toggle state */
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  /* ADD REF */
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ADD OUTSIDE CLICK HANDLER */
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDepartmentDropdown(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  /* HANDLERS */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  /* MULTI SELECT DEPARTMENT HANDLER */

  const handleDepartmentChange = (value: number) => {

    if (form.department.includes(value)) {

      setForm({
        ...form,
        department: form.department.filter(d => d !== value)
      });

    }
    else {

      setForm({
        ...form,
        department: [...form.department, value]
      });

    }

  };


  const mapAdminType = (value: string): number | undefined => {

    if (value === "Standard Admin") return 2;
    if (value === "Guest Admin") return 3;

    return undefined;

  };


  const mapGender = (value: string): number | undefined => {

    if (!value) return undefined;

    return Number(value);

  };


  /* SUBMIT */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!doPasswordsMatch(form.password, form.confirmPassword)) {

      toast.error("Password and Confirm Password must match");
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

    if (!isStrongPassword(form.password)) {

      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number and special character"
      );

      return;

    }

    const adminTypeValue = mapAdminType(form.adminType);
    const genderValue = mapGender(form.gender);

    if (!adminTypeValue) {

      toast.error("Please select Admin Type");
      return;

    }

    if (
  form.adminType === "Standard Admin" &&
  form.department.length === 0
) {

  toast.error("Please select Department");
  return;

}

    const payload = {

      first_name: form.firstName,
      middle_name: form.middleName || undefined,
      last_name: form.lastName,
      phone_no: form.phone,
      email: form.email,
      admin_type: adminTypeValue,
      gender: genderValue,
      password: form.password,
      confirm_password: form.confirmPassword,
    department_id:
  adminTypeValue === 2
    ? [...form.department]   
    : []

    };

    setLoading(true);

    try {

      const res = await createAdminApi(payload);

      if (res.data.success) {

        dispatch(addAdmin(res.data.data));

        toast.success("Admin created successfully");

        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          phone: "",
          email: "",
          adminType: "",
          department: [],
          gender: "",
          password: "",
          confirmPassword: "",
        });

      }
      else {

        toast.error(res.data.message || "Failed to create admin");

      }

    }
    catch {

      toast.error("Something went wrong");

    }
    finally {

      setLoading(false);

    }

  };


  /* UI */

  const inputClass =
  "w-full h-11 rounded-xl border border-gray-600 dark:border-gray-200 px-3 pr-10 text-sm text-gray-700 dark:text-gray-50 placeholder:text-gray-700 dark:placeholder:text-gray-50 focus:border-gray-600 dark:focus:border-gray-200 focus:ring-1 focus:ring-gray-600 dark:focus:ring-gray-200 outline-none bg-backdrop-blur-md";

  return (

    <div className="min-h-[calc(100vh-110px)] bg-cover bg-center flex flex-col justify-start px-10 pt-18 py-10"
    style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}
    >

      <div className=" w-full max-w-5xl p-8 pt-9 rounded-3xl relative backdrop-blur-md mx-auto">

          {/* top-left */}
  <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gray-400 dark:border-slate-200 rounded-tl-3xl"></span>

  {/* top-right */}
  <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gray-400 dark:border-slate-400 rounded-tr-3xl"></span>

  {/* bottom-left */}
  <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gray-400 dark:border-slate-300 rounded-bl-3xl"></span>

  {/* bottom-right */}
  <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gray-400 dark:border-slate-400 rounded-br-3xl"></span>


      <h2 className="text-xl text-cyan-700 dark:text-gray-50 text-center  font-bold mb-6">Create Admin</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* PERSONAL DETAILS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="First Name"
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
          />

        </div>


        {/* CONTACT */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="Phone Number"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="Email"
          />

        </div>


        {/* ROLE */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ADMIN TYPE */}

          <select
  name="adminType"
  value={form.adminType}
  onChange={(e) => {

    const value = e.target.value;

    setForm({
      ...form,
      adminType: value,

      // clear department if Guest Admin selected
      department: value === "Guest Admin" ? [] : form.department

    });

  }}
  className={inputClass}
>

  <option className="bg-white dark:bg-black text-black dark:text-white" value="">
    Select Admin Type
  </option>

  <option className="bg-white dark:bg-black text-black dark:text-white">
    Standard Admin
  </option>

  <option className="bg-white dark:bg-black text-black dark:text-white">
    Guest Admin
  </option>
          </select>


          {/* MULTI CHECKBOX DEPARTMENT */}

          <div className="relative" ref={dropdownRef}>

            <div
  className={
    inputClass +
    " cursor-pointer flex items-center justify-between " +
    (form.adminType === "Guest Admin"
      ? "bg-gray-200 cursor-not-allowed"
      : "")
  }

  onClick={() => {

    if (form.adminType === "Guest Admin") return;

    setShowDepartmentDropdown(!showDepartmentDropdown);

  }}
>

              {
                form.department.length > 0
                  ? DOCTOR_SPECIALIZATIONS
                      .filter(dept => form.department.includes(dept.value))
                      .map(dept => dept.label)
                      .join(", ")
                  : "Select Department"
              }
            </div>

            {showDepartmentDropdown && (

              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">

                {DOCTOR_SPECIALIZATIONS.map((dept) => (

                  <label
                    key={dept.value}
                    className="flex items-center px-3 py-2 hover:bg-blue-500 bg-white dark:bg-gray-900 text-black dark:text-white cursor-pointer"
                  >

                    <input
  type="checkbox"
  checked={form.department.includes(dept.value)}

  onChange={() => {

    if (form.adminType === "Guest Admin") return;

    handleDepartmentChange(dept.value);

  }}

  disabled={form.adminType === "Guest Admin"}

  className="mr-2 "
/>


                    {dept.department}

                  </label>

                ))}

              </div>

            )}

          </div>


          {/* GENDER */}

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option className=" bg-white dark:bg-black text-black dark:text-white" value="">Select Gender</option>

            {genderOption.map((g) => (

              <option key={g.value} value={g.value} className=" bg-white dark:bg-black text-black dark:text-white">
                {g.label}
              </option>

            ))}

          </select>

        </div>


        {/* PASSWORD */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
          <div className="relative ">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`${inputClass} h-11 pr-10`}
              placeholder="Password"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-700 dark:text-gray-100 pointer-events-auto"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>          

          </div>

           {form.password && (
              <p className="text-sm mt-1">
                Strength: {passwordStrength}
              </p>
            )}

            </div>

              <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`${inputClass} h-11  pr-10`}
              placeholder="Confirm Password"
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-700 dark:text-gray-100"
            >
              {showConfirmPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>  
          </div>

          {form.confirmPassword && !passwordsMatch && (
              <p className="text-red-600 h-5 text-sm mt-1">
                Password does not match
              </p>
            )}
</div>

        </div>


        {/* BUTTON */}

        <div className="flex justify-end pt-4">

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-500 hover:from-cyan-900 hover:to-cyan-700 dark:from-cyan-900 dark:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-cyan-500 text-white rounded-md "
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>

        </div>

      </form>
      </div>

    </div>

  );

};

export default CreateAdmin;
