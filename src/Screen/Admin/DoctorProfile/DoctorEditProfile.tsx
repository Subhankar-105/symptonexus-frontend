import React, { useEffect, useMemo, useState } from "react";
import type { AppDispatch } from "../../../../store/store";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
import { saveDoctorProfileApi } from "../../../services/doctorProfileApi";

import type {
  DoctorProfilePayload,
  AddressPayload,
  ExperiencePayload,
} from "../../../services/doctorProfileApi";
import type { RootState } from "../../../../store/store";

const DoctorEditProfile: React.FC = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
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

  const doctorFromState = location.state;
  const doctorFromStore = useSelector((state: RootState) => state.doctor?.doctors || []);

  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctorListThunk());
  }, [dispatch]);

  const doctor = useMemo(() => {
    return (
      doctorFromStore.find((d) => d.doctor_id === Number(doctorId)) ||
      doctorFromState ||
      null
    );
  }, [doctorFromStore, doctorFromState, doctorId]);

  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    doctor_no: "",
    licence_number: "",
    registration_number: "",
    experience: "",
    specialization: "",
    bio: "",
    status: "",
  });

  const [permanentAddress, setPermanentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });

  const [currentAddress, setCurrentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });

  const [experiences, setExperiences] = useState<ExperiencePayload[]>([
    {
      organization_name: "",
      start_date: "",
      end_date: "",
      designation: "",
      responsibilities: "",
    },
  ]);

  useEffect(() => {
    if (!doctor) return;

    const permanent =
      doctor?.permanent_address ||
      doctor?.doctor_address?.permanent_address ||
      {};

    const current =
      doctor?.current_address ||
      doctor?.doctor_address?.current_address ||
      {};

    setProfile({
      first_name: doctor?.first_name ?? "",
      middle_name: doctor?.middle_name ?? "",
      last_name: doctor?.last_name ?? "",
      dob: doctor?.dob ?? "",
      gender: doctor?.gender ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone_no ?? doctor?.phone ?? "",
      doctor_no: doctor?.doctor_no ?? "",
      licence_number: doctor?.licence_number ?? "",
      registration_number: doctor?.registration_number ?? "",
      experience: doctor?.experience ?? "",
      specialization: doctor?.specialization ?? "",
      bio: doctor?.bio ?? "",
      status: doctor?.status ?? "",
    });

    setPermanentAddress({
      address_line_1: permanent?.address_line_1 ?? "",
      address_line_2: permanent?.address_line_2 ?? "",
      city: permanent?.city ?? "",
      district: permanent?.district ?? "",
      state: permanent?.state ?? "",
      country: permanent?.country ?? "",
      pin: permanent?.pin ?? "",
    });

    setCurrentAddress({
      address_line_1: current?.address_line_1 ?? "",
      address_line_2: current?.address_line_2 ?? "",
      city: current?.city ?? "",
      district: current?.district ?? "",
      state: current?.state ?? "",
      country: current?.country ?? "",
      pin: current?.pin ?? "",
    });

    if (doctor?.doctor_experiences?.length) {
      setExperiences(
        doctor.doctor_experiences.map((exp: ExperiencePayload) => ({
          organization_name: exp?.organization_name ?? "",
          start_date: exp?.start_date ?? "",
          end_date: exp?.end_date ?? "",
          designation: exp?.designation ?? "",
          responsibilities: exp?.responsibilities ?? "",
        }))
      );
    }
  }, [doctor]);

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentChange = (key: keyof AddressPayload, value: string) => {
    const updated = { ...permanentAddress, [key]: value };
    setPermanentAddress(updated);

    if (sameAddress) {
      setCurrentAddress(updated);
    }
  };

  const handleCurrentChange = (key: keyof AddressPayload, value: string) => {
    setCurrentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    setSameAddress((prev) => {
      const next = !prev;
      if (next) {
        setCurrentAddress({ ...permanentAddress });
      }
      return next;
    });
  };

  const handleExpChange = (
    index: number,
    key: keyof ExperiencePayload,
    value: string
  ) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        organization_name: "",
        start_date: "",
        end_date: "",
        designation: "",
        responsibilities: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (!doctor?.doctor_id) {
        toast.error("Doctor ID missing");
        return;
      }

      setLoading(true);

      let payload: DoctorProfilePayload = {
        dob: profile.dob,
        licence_number: profile.licence_number,
        registration_number: profile.registration_number,
        experience: profile.experience,
        bio: profile.bio,
        current_address: {
          address_line_1: currentAddress.address_line_1 || "",
          address_line_2: currentAddress.address_line_2 || "",
          city: currentAddress.city || "",
          district: currentAddress.district || "",
          state: currentAddress.state || "",
          country: currentAddress.country || "",
          pin: currentAddress.pin || "",
        },
        permanent_address: {
          address_line_1: permanentAddress.address_line_1 || "",
          address_line_2: permanentAddress.address_line_2 || "",
          city: permanentAddress.city || "",
          district: permanentAddress.district || "",
          state: permanentAddress.state || "",
          country: permanentAddress.country || "",
          pin: permanentAddress.pin || "",
        },
      };

      if (step === 2) {
        payload = {
          ...payload,
          experiences: experiences.map((exp) => ({
            organization_name: exp.organization_name || "",
            start_date: exp.start_date || "",
            end_date: exp.end_date || "",
            designation: exp.designation || "",
            responsibilities: exp.responsibilities || "",
          })),
        };
      }

      const res = await saveDoctorProfileApi(doctor.doctor_id, payload);

      if (res?.data?.success) {
        toast.success(res.data.message || "Profile saved");
      } else {
        toast.error(res?.data?.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  return (
    <div className="p-7 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen">
      
        <ProfileAvatar
          firstName={doctor.first_name || ""}
          lastName={doctor.last_name || ""}
        />

       
          <StepIndicator step={step} onStepClick={setStep} />

          {step === 1 && (
            <>
            <fieldset className="border border-gray-500 dark:border-gray-200 p-5  rounded-2xl mb-4">
            <legend className="text-sm text-gray-700 dark:text-gray-200 font-semibold px-2">Personal Details</legend>

                <div className="grid md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200">
                  <Field
                    label="First Name"
                    value={profile.first_name}
                    onChange={(v) => handleChange("first_name", v)}
                    disabled
                  />
                  <Field
                    label="Middle Name"
                    value={profile.middle_name}
                    onChange={(v) => handleChange("middle_name", v)}
                    disabled
                  />
                  <Field
                    label="Last Name"
                    value={profile.last_name}
                    onChange={(v) => handleChange("last_name", v)}
                    disabled
                  />
                </div>

                <div className="grid md:grid-cols-3 text-gray-700 dark:text-gray-200 gap-4 pt-3  focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200 items-end">

                               <div>
                    <h1 className="text-sm pl-1">Date of Birth</h1>
                  <div className="border-gray-600 dark:border-gray-200 border rounded-sm py-1 pl-2 pt-1 pb-1 mt-1 focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={profile.dob ? dayjs(profile.dob) : null}
                        onChange={(v: Dayjs | null) =>
                          handleChange("dob", v ? v.format("YYYY-MM-DD") : "")
                        }
                         format="YYYY-MM-DD"
                         enableAccessibleFieldDOMStructure={false}
                         slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            placeholder: "Date of Birth",
                            variant: "standard", 
                            InputProps: {
                              disableUnderline: true, 
                            },
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "1px",
                                backgroundColor: "#ffffff !important",
                                boxShadow: "none !important",
                  
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                              },
                  
                              "& .MuiSvgIcon-root": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input::placeholder": {
                                color: isDark ? "#E5E7EB" : "#374151",
                                opacity: 1,
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    </div>
                  </div>
                  



                   <Field
                    label="Gender"
                    value={profile.gender}
                    onChange={(v) => handleChange("doctor_no", v)}
                    disabled
                  />



                  <Field
                    label="Doctor Number"
                    value={profile.doctor_no}
                    onChange={(v) => handleChange("doctor_no", v)}
                    disabled
                  />

                  <Field
                    label="Licence Number"
                    value={profile.licence_number}
                    onChange={(v) => handleChange("licence_number", v)}
                  
                  />

                  <Field
                    label="Registration Number"
                    value={profile.registration_number}
                    onChange={(v) => handleChange("registration_number", v)}
                  />

                  <Field
                    label="Experience"
                    value={profile.experience}
                    onChange={(v) => handleChange("experience", v)}
                  />

                  

                  <Field
                    label="Specialization"
                    value={profile.specialization}
                    onChange={(v) => handleChange("specialization", v)}
                    disabled
                  />
                </div>

                <div className="pt-3">
                  <label className="text-sm pl-1 text-gray-700 dark:text-gray-200">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    className="w-full border border-gray-700 dark:border-gray-200 p-2 rounded-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
                  />
                </div>
              </fieldset>

             <fieldset className="border p-4 border-gray-500 dark:border-gray-200 mb-4  rounded-2xl">
            <legend className="text-sm px-2 text-gray-700 dark:text-gray-200 font-semibold">Address Details</legend>

                <div className="grid md:grid-cols-2 text-gray-700 dark:text-gray-200 gap-6">
              <fieldset className="border p-4  rounded-2xl">
                <legend className="text-sm p-2 font-semibold mb-6">Permanent Address</legend>
                <AddressFields state={permanentAddress} handler={handlePermanentChange} />
              </fieldset>

              <fieldset className="border p-4 rounded-2xl">
                <legend className="text-sm p-2 font-semibold">Current Address</legend>

                <label className="text-xs flex items-center ml-100 mb-2 gap-2">
                  <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                  Same as Permanent
                </label>

                    <AddressFields
                      state={currentAddress}
                      handler={handleCurrentChange}
                      disabled={sameAddress}
                    />
                  </fieldset>
                </div>
              </fieldset>
            </>
          )}

          {step === 2 && (
             <fieldset className="border p-4 border-gray-500 dark:border-gray-200 mb-4   rounded-2xl">
            <legend className="text-sm px-2 text-gray-700 dark:text-gray-200 font-semibold">Experience Details</legend>

              <div className="space-y-4  ">
                {experiences.map((exp, index) => (
                  <div key={index}>
                    <div className="grid md:grid-cols-2 text-gray-700 dark:text-gray-200 gap-4 ">
                      <Field
                        label="Organization Name"
                        value={exp.organization_name ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "organization_name", v)
                        }
                      />

                      <Field
                        label="Designation"
                        value={exp.designation ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "designation", v)
                        }
                      />

                               <div>
                    <h1 className="text-sm pl-1">Start Date</h1>
                  <div className="border-gray-600 dark:border-gray-200 border rounded-sm py-1 pl-2 pt-1 pb-1 mt-1 focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={exp.start_date ? dayjs(exp.start_date) : null}
                        onChange={(v: Dayjs | null) =>
                          handleExpChange(index, "start_date", v ? v.format("YYYY-MM-DD") : "")
                        }
                         format="YYYY-MM-DD"
                         enableAccessibleFieldDOMStructure={false}
                         slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            placeholder: "Start Date",
                            variant: "standard", 
                            InputProps: {
                              disableUnderline: true, 
                            },
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "1px",
                                backgroundColor: "#ffffff !important",
                                boxShadow: "none !important",
                  
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                              },
                  
                              "& .MuiSvgIcon-root": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input::placeholder": {
                                color: isDark ? "#E5E7EB" : "#374151",
                                opacity: 1,
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    </div>
                  </div>

                                                          <div>
                    <h1 className="text-sm pl-1">End Date</h1>
                  <div className="border-gray-600 dark:border-gray-200 border rounded-sm py-1 pl-2 pt-1 pb-1 mt-1 focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={exp.end_date ? dayjs(exp.end_date) : null}
                          onChange={(v: Dayjs | null) =>
                          handleExpChange(index, "end_date", v ? v.format("YYYY-MM-DD") : "")
                        }
                         format="YYYY-MM-DD"
                         enableAccessibleFieldDOMStructure={false}
                         slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            placeholder: "End Date",
                            variant: "standard", 
                            InputProps: {
                              disableUnderline: true, 
                            },
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "1px",
                                backgroundColor: "#ffffff !important",
                                boxShadow: "none !important",
                  
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                  
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                              },
                  
                              "& .MuiSvgIcon-root": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input": {
                                color: isDark ? "#E5E7EB" : "#374151",
                              },
                  
                              "& .MuiInputBase-input::placeholder": {
                                color: isDark ? "#E5E7EB" : "#374151",
                                opacity: 1,
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    </div>
                  </div>


                    </div>

                    <div className="pt-3 ">
                      <label className="text-sm  text-gray-700 dark:text-gray-200 pl-1">Responsibilities</label>
                      <textarea
                        value={exp.responsibilities ?? ""}
                        onChange={(e) =>
                          handleExpChange(index, "responsibilities", e.target.value)
                        }
                        rows={4}
                        className="w-full border p-2 rounded-sm 
                        text-gray-700 dark:text-gray-200
                        outline-none focus:outline-none 
                        focus:ring-1 
                        focus:border-gray-600 dark:focus:border-gray-200"
                      />
                    </div>

                    {experiences.length > 1 && (
                      <div className="pt-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="px-4 py-2 rounded-sm bg-red-500 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 rounded-sm bg-green-600 text-white hover:bg-green-700"
                  >
                    Add More Experience
                  </button>
                </div>
              </div>
            </fieldset>
          )}

          <div className="flex justify-between mt-10">
            <div className="flex gap-4">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1 || loading}
                className="px-6 py-2 pl-4 rounded-lg bg-sky-700 hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-400 text-white disabled:bg-gray-400 dark:disabled:bg-gray-500"
              >
                ← Back
              </button>
            </div>

            <div className="flex gap-4">
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-sky-700 hover:bg-sky-900 dark:bg-sky-600 text-white dark:hover:bg-sky-400 disabled:bg-gray-400"
                >
                  Next →
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-cyan-600 dark:bg-sky-700 text-white hover:bg-cyan-800 dark:hover:bg-cyan-600 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        
      
    </div>
  );
};

export default DoctorEditProfile;

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <label className="text-sm pl-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
className={`w-full border p-2 
  outline-none focus:outline-none focus:ring-1 
  focus:border-gray-600 dark:focus:border-gray-200
  ${disabled ? "cursor-not-allowed rounded-sm" : "rounded-sm"}
`}
    />
  </div>
);

const AddressFields = ({
  state,
  handler,
  disabled = false,
}: {
  state: AddressPayload;
  handler: (key: keyof AddressPayload, value: string) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-3">
    <input
      placeholder="Address Line 1"
      value={state.address_line_1 ?? ""}
      onChange={(e) => handler("address_line_1", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="Address Line 2"
      value={state.address_line_2 ?? ""}
      onChange={(e) => handler("address_line_2", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="City"
      value={state.city ?? ""}
      onChange={(e) => handler("city", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="District"
      value={state.district ?? ""}
      onChange={(e) => handler("district", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="State"
      value={state.state ?? ""}
      onChange={(e) => handler("state", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="Country"
      value={state.country ?? ""}
      onChange={(e) => handler("country", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:border-gray-900 dark:focus:border-gray-200"
    />
    <input
      placeholder="Pincode"
      value={state.pin ?? ""}
      onChange={(e) => handler("pin", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded focus:ring-1 focus:outline-none focus:border-gray-900 dark:focus:border-gray-200"
    />
  </div>
);

const ProfileAvatar = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-cyan-600 dark:bg-gray-500 flex items-center justify-center text-white text-2xl font-semibold border-2 border-cyan-100 dark:border-gray-600 shadow-lg">
          {initials}
        </div>

        <button
          className="absolute bottom-0 right-0 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-cyan-100 transition"
        >
          <PencilSquareIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => {
  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Experience Details" },
  ];

  return (
    <div className="mb-10 w-full px-10">
      <div className="flex items-center w-full">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  step >= s.id
                    ? "bg-cyan-600 dark:bg-white text-white dark:text-gray-600"
                    : "bg-gray-400 dark:bg-gray-500 text-white"
                }`}
              >
                {s.id}
              </div>

              <span
                className={`mt-2 text-xs text-center ${
                  step >= s.id
                    ? "text-cyan-600 dark:text-white font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-4 ${
                  step > s.id ? "bg-cyan-600 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-400"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};