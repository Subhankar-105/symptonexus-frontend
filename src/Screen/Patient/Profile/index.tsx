import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import ProfileAvatar from "./ProfileAvatar";
import { isValidDOB, calculateAge, getGenderLabel } from "../../../Environment";
import { savePatientProfileApi } from "../../../services/patientProfileApi";
import { setProfile } from "../../../../store/slices/authSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface EditableProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;

  dob: string;
  age: string;
  maritalStatus: string;
  occupation: string;

  currentAddress: string;
  permanentAddress: string;

  bloodGroup: string;
  height: string;
  weight: string;

  allergies: string[];
  smoking: boolean | null;
  alcohol: boolean | null;
}

/* ================= CONSTANTS ================= */

const ALLERGY_OPTIONS = [
  "Food",
  "Drug / Medication",
  "Environmental",
  "Insect / Sting",
  "Latex",
  "Pet / Animal",
  "Chemical",
  "Other",
  "None"
];

/* ================= BLOOD GROUP MAP ================= */

const numberToBloodGroup: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

const bloodGroupToNumber: Record<string, number> = {
  "A+": 1,
  "A-": 2,
  "B+": 3,
  "B-": 4,
  "AB+": 5,
  "AB-": 6,
  "O+": 7,
  "O-": 8,
};
/* ================= COMPONENT ================= */

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
   const reduxProfile = useSelector(
  (state: RootState) => state.auth.profile
);
  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

const [currentAddress, setCurrentAddress] = useState({
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
});

const [permanentAddress, setPermanentAddress] = useState({
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pincode: "",
});

  const [profile, setProfileState] = useState<EditableProfile>({
  firstName: user?.first_name || "",
  middleName: user?.middle_name || "",
  lastName: user?.last_name || "",
  email: user?.email || "",
  phone: user?.phone_no || "",
  gender: user?.gender || "",

  dob: reduxProfile?.dob || "",
  age: reduxProfile?.dob ? calculateAge(reduxProfile.dob) : "",

  maritalStatus: reduxProfile?.marital_status || "",
  occupation: reduxProfile?.occupation || "",

  bloodGroup: reduxProfile?.blood_group
  ? numberToBloodGroup[reduxProfile.blood_group] ?? ""
  : "",

  height: reduxProfile?.height?.toString() || "",
  weight: reduxProfile?.weight?.toString() || "",

  allergies: reduxProfile?.allergies || [],
  smoking: reduxProfile?.smoking ?? null,
  alcohol: reduxProfile?.alcohol ?? null,

  currentAddress: "",
  permanentAddress: "",
});

  /* ================= PROFILE COMPLETION ================= */

  const completion = Math.round(
    (Object.values(profile).filter(v =>
      Array.isArray(v) ? v.length : v !== "" && v !== null
    ).length /
      Object.keys(profile).length) *
      100
  );

  const handleSameAddressToggle = () => {
  const checked = !sameAddress;
  setSameAddress(checked);

  if (checked) {
    setPermanentAddress({ ...currentAddress });
  }
};



  /* ================= SAVE ================= */


  
  const handleSave = async () => {
  if (!isValidDOB(profile.dob)) {
    toast.error("Invalid Date of Birth");
    return false;
  }

  if (!user?.patient_id) {
    toast.error("Patient ID missing");
    return false;
  }

    try {
      //  ONLY FIX: null → undefined
   const payload = {
  patient_id: user.patient_id,

  dob: profile.dob || undefined,
  marital_status: profile.maritalStatus || undefined,
  occupation: profile.occupation || undefined,

  blood_group: profile.bloodGroup
    ? bloodGroupToNumber[profile.bloodGroup]
    : undefined,

  height: profile.height ? Number(profile.height) : undefined,
  weight: profile.weight ? Number(profile.weight) : undefined,

  allergies: profile.allergies.length
    ? profile.allergies
    : undefined,

  smoking: profile.smoking ?? undefined,
  alcohol: profile.alcohol ?? undefined,
current_address: currentAddress.addressLine1
  ? {
      address_line: [
        currentAddress.addressLine1,
        currentAddress.addressLine2,
      ]
        .filter(Boolean)
        .join(", "),
      city: currentAddress.city,
      district: currentAddress.district,
      state: currentAddress.state,
      country: currentAddress.country,
      pincode: currentAddress.pincode,
    }
  : undefined,

permanent_address: permanentAddress.addressLine1
  ? {
      address_line: [
        permanentAddress.addressLine1,
        permanentAddress.addressLine2,
      ]
        .filter(Boolean)
        .join(", "),
      city: permanentAddress.city,
      district: permanentAddress.district,
      state: permanentAddress.state,
      country: permanentAddress.country,
      pincode: permanentAddress.pincode,
    }
  : undefined,

};

      const res = await savePatientProfileApi(payload);

    if (res.data?.success) {
        toast.success("Profile saved successfully");

        console.log("SAVE RESPONSE FULL:", res.data);

      if (res.data?.data?.profile) {
        dispatch(setProfile(res.data.data.profile)); // VERY IMPORTANT
        localStorage.setItem("patientProfile", JSON.stringify(res.data.data.profile));
      }
  return true;
} else {
        toast.error(res.data?.data?.errorcode || "Save failed");
      }
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      return false;
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="relative max-w-5xl mx-auto bg-gradient-to-br from-sky-100 to-blue-200 shadow-xl rounded-lg p-8">

      {/* Profile Completion */}
      <div className="absolute top-6 right-6 bg-white shadow rounded p-4">
        <p className="text-sm font-medium">Profile Completion</p>
        <p className="text-blue-600 font-bold">{completion}%</p>
      </div>

      <ProfileAvatar
        firstName={profile.firstName}
        lastName={profile.lastName}
      />

      <h2 className="text-xl font-semibold mb-6">Patient Profile</h2>

      <StepIndicator step={step} onStepClick={setStep} />

      {/* ================= STEP 1 : BASIC INFORMATION ================= */}
      {step === 1 && (
        <div className=" rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="First Name" value={profile.firstName} disabled />
            <Field label="Middle Name" value={profile.middleName} disabled />
            <Field label="Last Name" value={profile.lastName} disabled />
            <Field label="Email" value={profile.email} disabled />
            <Field label="Phone" value={profile.phone} disabled />
            <Field
              label="Gender"
              value={getGenderLabel(profile.gender)}
              disabled
            />
          </div>
        </div>
      )}

      {/* ================= STEP 2 : PERSONAL DETAILS ================= */}
      {step === 2 && (
        <div className="space-y-8">

          {/* Personal Details */}
          <div className=" rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Personal Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="DD/MM/YYYY"
                  value={profile.dob ? dayjs(profile.dob) : null}
                  onChange={val => {
                    const dob = val ? val.format("YYYY-MM-DD") : "";
                    setProfileState({
                      ...profile,
                      dob,
                      age: calculateAge(dob),
                    });
                  }}
                />
              </LocalizationProvider>

              <Field label="Age" value={profile.age} disabled />

              <Field
                label="Occupation"
                value={profile.occupation}
                onChange={v =>
                  setProfileState({ ...profile, occupation: v })
                }
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Marital Status
                </label>
                <select
                  value={profile.maritalStatus}
                  onChange={e =>
                    setProfileState({
                      ...profile,
                      maritalStatus: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>
            </div>
          </div>

{/* Address Details */}
<div className=" rounded-lg p-6 shadow-sm ">
  <h3 className="text-lg font-semibold mb-6">Address Details</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* ================= CURRENT ADDRESS ================= */}
    <fieldset className="border border-gray-400 rounded-xl p-6">
      <legend className="px-3 text-sm font-semibold text-gray-800">
        Current Address
      </legend>

      <div className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Address Line 1</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.addressLine1}
              onChange={e =>
                setCurrentAddress({
                  ...currentAddress,
                  addressLine1: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="label">Address Line 2</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.addressLine2}
              onChange={e =>
                setCurrentAddress({
                  ...currentAddress,
                  addressLine2: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div >
            <label className="label">City</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.city}
              onChange={e =>
                setCurrentAddress({ ...currentAddress, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">District</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.district}
              onChange={e =>
                setCurrentAddress({
                  ...currentAddress,
                  district: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">State</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.state}
              onChange={e =>
                setCurrentAddress({ ...currentAddress, state: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Country</label>
            <input
              className="input w-full border px-3 py-2 rounded-md"
              value={currentAddress.country}
              onChange={e =>
                setCurrentAddress({
                  ...currentAddress,
                  country: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="label">PIN Code</label>
          <input
            className="input w-full border px-3 py-2 rounded-md"
            value={currentAddress.pincode}
            onChange={e =>
              setCurrentAddress({
                ...currentAddress,
                pincode: e.target.value,
              })
            }
          />
        </div>
      </div>
    </fieldset>

    {/* ================= PERMANENT ADDRESS ================= */}
    <fieldset className="border border-gray-400 rounded-xl p-6">
      <legend className="px-3 text-sm font-semibold text-gray-800">
        Permanent Address
      </legend>

      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={handleSameAddressToggle}
          />
          Same as Current
        </label>
      </div>

      <div className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Address Line 1</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.addressLine1}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  addressLine1: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="label">Address Line 2</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.addressLine2}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  addressLine2: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">City</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.city}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  city: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="label">District</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.district}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  district: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">State</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.state}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  state: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="label">Country</label>
            <input
              disabled={sameAddress}
              className="input w-full border px-3 py-2 rounded-md"
              value={permanentAddress.country}
              onChange={e =>
                setPermanentAddress({
                  ...permanentAddress,
                  country: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="label">PIN Code</label>
          <input
            disabled={sameAddress}
            className="input w-full border px-3 py-2 rounded-md"
            value={permanentAddress.pincode}
            onChange={e =>
              setPermanentAddress({
                ...permanentAddress,
                pincode: e.target.value,
              })
            }
          />
        </div>
      </div>
    </fieldset>

  </div>
</div>
</div>

  )}
      {/* ================= STEP 3 : MEDICAL INFORMATION ================= */}
      {step === 3 && (
        <div className = "rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Medical Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
  <label className="block text-sm font-medium mb-1">Blood Group</label>
  <select
    value={profile.bloodGroup}
    onChange={e =>
      setProfileState({ ...profile, bloodGroup: e.target.value })
    }
    className="w-full border px-3 py-2 rounded-md"
  >
    <option value="">Select</option>
    {Object.values(numberToBloodGroup).map(bg => (
      <option key={bg} value={bg}>
        {bg}
      </option>
    ))}
  </select>
</div>
            <Field label="Height (cm)" value={profile.height}
              onChange={v => setProfileState({ ...profile, height: v })} />
            <Field label="Weight (kg)" value={profile.weight}
              onChange={v => setProfileState({ ...profile, weight: v })} />
            <AllergySelect value={profile.allergies}
              onChange={v => setProfileState({ ...profile, allergies: v })} />
            <YesNo label="Do you smoke?" value={profile.smoking}
              onChange={v => setProfileState({ ...profile, smoking: v })} />
            <YesNo label="Do you consume alcohol?" value={profile.alcohol}
              onChange={v => setProfileState({ ...profile, alcohol: v })} />
          </div>
        </div>
      )}

      {/* ================= NAVIGATION ================= */}
<div className="flex justify-between mt-10">

  {/* BACK BUTTON (Step > 1) */}
  <button
    onClick={() => setStep(s => Math.max(1, s - 1))}
    disabled={step === 1}
    className="px-6 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300"
  >
    ← Back
  </button>

  {/* STEP 2 : BACK + SAVE + NEXT */}
  {step === 2 && (
    <div className="flex gap-4">
      <button
        onClick={handleSave}
        className="px-6 py-2 rounded-md bg-green-600 text-white"
      >
        Save
      </button>

      <button
        onClick={() => setStep(3)}
        className="px-6 py-2 rounded-md bg-blue-600 text-white"
      >
        Next →
      </button>
    </div>
  )}

  {/* STEP 1 : NEXT */}
  {step === 1 && (
    <button
      onClick={() => setStep(2)}
      className="px-8 py-2 bg-blue-600 text-white rounded-md"
    >
      Next →
    </button>
  )}

  {/* STEP 3 : SAVE */}
  {step === 3 && (
    <button
     onClick={async () => {   //  async added here
      const ok = await handleSave();
      if (ok) {
        navigate("/patient");
      }
    }}
      className="px-8 py-2 bg-green-600 text-white rounded-md"
    >
      Save
    </button>
  )}
</div>

    </div>
  </div>
);
};

export default Profile;

/* ================= HELPER COMPONENTS ================= */

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => {
  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Personal Details" },
    { id: 3, label: "Medical Information" },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                ${
                  step >= s.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {s.id}
              </div>

              {/* Step Name */}
              <span
                className={`mt-2 text-xs text-center w-24
                ${
                  step >= s.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 mb-6
                ${
                  step > s.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const AllergySelect = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (item: string) => {
    onChange(
      value.includes(item)
        ? value.filter(v => v !== item)
        : [...value, item]
    );
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium mb-1">Allergy Types</label>
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[42px] border rounded-md px-2 py-1 flex flex-wrap gap-2 cursor-pointer bg-white"
      >
        {value.length === 0 && (
          <span className="text-gray-400">Select allergy types</span>
        )}
        {value.map(v => (
          <span
            key={v}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm"
          >
            {v}
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow-lg">
          {ALLERGY_OPTIONS.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const YesNo = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-4 py-1 mr-2 ${
        value === true ? "bg-blue-600 text-white" : "border"
      }`}
    >
      Yes
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-4 py-1 ${
        value === false ? "bg-blue-600 text-white" : "border"
      }`}
    >
      No
    </button>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      value={value}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    />
  </div>
);

