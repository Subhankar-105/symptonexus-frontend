import type { IconType } from "react-icons";
import {
  FiHome,
  FiCheckSquare,
  FiCalendar,
  FiMessageSquare,
  FiLogOut,
  FiUsers,
  FiUserPlus,
  FiClock,
  FiGrid
} from "react-icons/fi";

import { FaCalendarCheck, } from "react-icons/fa";

import shreyaImg from "./assets/Shreya.png";
import subhaImg from "./assets/Subhankar.png";
import ranaImg from "./assets/Ranabir.png";
import rinkiImg from "./assets/Rinki.png";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  desc: string;
  img: string;
  email: string;
  num: number;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Shreya Das",
    role: "Full Stack + Database Developer (Main Developer)",
    desc: "Works on both frontend and backend parts of the project. Focuses on implementing features and ensuring smooth application functionality.",
    img: shreyaImg,
    email: "das.shreya.sid@gmail.com",
    num: 7001142661
  },
  {
    id: 2,
    name: "Subhankar Basak",
    role: "UI/UX Designer + Frontend Developer (Helper)",
    desc: "Handles the visual layout and user interface design. Pays attention to clarity, usability, and consistent design across the application.",
    img: subhaImg,
    email: "subhankar612003@gmail.com",
    num: 9434824762
  },
  {
    id: 3,
    name: "Ranabir Basak",
    role: "ML Designer + Frontend Developer (Helper)",
    desc: "Works on machine learning components and data handling tasks. Assists in building and testing models used within the project.",
    img: ranaImg,
    email: "ranabirbasak2004@gmail.com",
    num: 7679006309
  },
    {
    id: 4,
    name: "Rinki Singha Roy",
    role: "---",
    desc: "-----",
    img: rinkiImg,
    email: "rinkisingharoy850@gmail.com",
    num: 7797185159
  },
];


// for faq questions
export interface  FAQItem  {
  question: string;
  answer: string;
};


  export const faqData: FAQItem[] = [
  {
    question: "What is SymptoNexus?",
    answer:
      "SymptoNexus is a digital healthcare platform designed to help users assess symptoms, manage health-related information, and connect with healthcare professionals securely.",
  },
  {
    question: "Who should use SymptoNexus?",
    answer:
      "SymptoNexus can be used by patients, doctors, and administrators. Each user role has specific features and access permissions.",
  },
  {
    question: "Is SymptoNexus a replacement for a doctor?",
    answer:
      "No. SymptoNexus is not a substitute for professional medical advice. It is intended to support users in understanding symptoms and seeking appropriate care.",
  },
  {
    question: "How does SymptoNexus analyze symptoms?",
    answer:
      "The platform uses structured medical data and predefined logic to analyze symptoms and provide general health insights for informational purposes.",
  },
  {
    question: "Is my personal and medical data secure?",
    answer:
      "Yes. SymptoNexus uses secure authentication and role-based access control to protect personal and medical information.",
  },
  {
    question: "What should I do in case of a medical emergency?",
    answer:
      "In a medical emergency, users should immediately contact local emergency services or visit the nearest hospital. SymptoNexus should not be used for emergency diagnosis.",
  },
  {
    question: "Can I book both online and in-person appointments?",
    answer:
      "Yes. SymptoNexus allows patients to book both virtual (online) and physical (in-person) appointments with available doctors through the platform.",
  },
  {
    question: "Do I need to create an account to use SymptoNexus?",
    answer:
      "Patients are required to create an account to access features such as appointment booking and personalized services. Doctors and administrators receive login credentials from the system administrator.",
  },
  {
    question: "Does the chatbot suggest medicines or medical tests?",
    answer:
      "No. The chatbot does not recommend medicines, medical tests, or treatments. It only provides general information and safe home remedies for awareness and comfort.",
  },
  {
    question: "How accurate is the symptom prediction feature?",
    answer:
      "The symptom analysis feature provides approximate and educational insights based on available data. It should not be considered a medical diagnosis and must be followed by professional consultation when needed.",
  },
  {
    question: "Can doctors view patient information?",
    answer:
      "Yes. Doctors can view basic patient-provided information relevant to scheduled appointments, helping them prepare for consultations while maintaining data privacy.",
  },
  {
    question: "Who manages doctor accounts on SymptoNexus?",
    answer:
      "Doctor accounts are created and managed exclusively by the system administrator to ensure authenticity and controlled access.",
  },
  {
    question: "Will SymptoNexus store my medical history?",
    answer:
      "Currently, SymptoNexus stores only essential information required for platform functionality. Future versions may include optional medical history features with user consent.",
  },

];

export const HEALTH_TIPS = [
  "Start your day with a glass of water.",
  "Take short walks during work breaks.",
  "Eat slowly and chew food properly.",
  "Keep a fixed sleep and wake schedule.",
  "Avoid late night heavy meals.",
  "Add fiber rich foods to your diet.",
  "Choose stairs over elevators often.",
  "Limit caffeine intake after evening.",
  "Wash fruits before eating them.",
  "Use less oil while cooking meals.",
  "Avoid eating when feeling stressed.",
  "Include nuts and seeds in snacks.",
  "Maintain good posture while sitting.",
  "Take deep breaths during busy hours.",
  "Avoid mobile phones before sleep.",
  "Expose yourself to morning sunlight.",
  "Drink water before every meal.",
  "Avoid lying down after eating food.",
  "Replace soda with fresh juices.",
  "Practice gratitude for mental health.",
  "Spend time outdoors every day.",
  "Reduce screen brightness at night.",
  "Avoid eating food too fast.",
  "Include whole grains in meals.",
  "Avoid excessive salt in cooking.",
  "Take regular breaks from sitting.",
  "Stretch your neck and shoulders.",
  "Keep healthy snacks within reach.",
  "Avoid skipping meals during day.",
  "Get fresh air whenever possible.",
  "Practice mindful eating habits.",
  "Limit packaged food consumption.",
  "Drink water even when not thirsty.",
  "Avoid late night screen exposure.",
  "Keep your living space ventilated.",
  "Maintain cleanliness around you.",
  "Eat seasonal fruits regularly.",
  "Avoid stress eating habits.",
  "Listen to calming music daily.",
  "Limit intake of sugary desserts.",
  "Avoid long hours of inactivity.",
  "Practice yoga or light exercises.",
  "Maintain consistent meal timings.",
  "Reduce intake of refined carbs.",
  "Choose baked over fried foods.",
  "Avoid overeating at social events.",
  "Drink warm water in the morning.",
  "Get enough vitamin D daily.",
  "Avoid distractions while eating.",
  "Limit salt in packaged foods.",
  "Keep your spine straight while sitting.",
  "Avoid emotional eating patterns.",
  "Stay active during weekends too.",
  "Maintain a regular exercise routine.",
  "Avoid midnight snacking habits.",
  "Eat more home cooked food.",
  "Stay connected with loved ones.",
  "Avoid using phone during meals.",
  "Choose fruits over sugary snacks.",
  "Avoid excessive tea or coffee.",
  "Keep track of daily water intake.",
  "Stretch legs after long sitting.",
  "Avoid prolonged screen usage.",
  "Keep your mind calm and focused.",
  "Avoid negative self talk habits.",
  "Include salads in daily meals.",
  "Practice slow and deep breathing.",
  "Avoid eating just before sleep.",
  "Spend time in natural sunlight.",
  "Avoid junk food cravings often.",
  "Take care of your eye health.",
  "Avoid lifting heavy loads wrongly.",
  "Maintain balance between work and rest.",
  "Drink herbal teas occasionally.",
  "Avoid eating out too frequently.",
  "Stay positive and stress free.",
  "Keep a bottle of water nearby.",
  "Avoid prolonged mobile scrolling.",
  "Practice good hand hygiene daily.",
  "Avoid touching face frequently.",
  "Eat breakfast within one hour.",
  "Include healthy fats in meals.",
  "Avoid excess sugar in tea.",
  "Get proper rest after workouts.",
  "Avoid processed meat products.",
  "Stay consistent with sleep timing.",
  "Avoid binge eating at night.",
  "Practice relaxation before bedtime.",
  "Keep your back supported while sitting.",
  "Avoid loud music with earphones.",
  "Stay mindful of portion sizes.",
  "Avoid sitting cross legged long.",
  "Stretch arms and wrists regularly.",
  "Avoid heavy meals before travel.",
  "Keep your surroundings clutter free.",
  "Avoid exposure to secondhand smoke.",
  "Drink water after waking up.",
  "Practice self care daily.",
  "Avoid skipping hydration during travel.",
  "Limit fried snacks consumption.",
  "Eat light dinners whenever possible.",
  "Avoid holding urine for long.",
  "Practice calm breathing exercises.",
  "Avoid late night caffeine intake.",
  "Keep body movements gentle and steady.",
  "Avoid multitasking while eating.",
  "Maintain a calm bedtime routine.",
  "Avoid excess screen glare exposure.",
  "Choose walking over short rides.",
  "Stay physically active every day.",
  "Limit intake of artificial sweeteners.",
  "Avoid eating under stress.",
  "Practice stretching before sleep.",
  "Avoid long naps during daytime.",
  "Eat balanced meals regularly.",
  "Avoid dehydration in hot weather.",
  "Stay relaxed during busy schedules.",
  "Keep healthy habits consistent.",
  "Avoid excess intake of fast food.",
  "Take time to relax daily.",
  "Avoid slouching while standing.",
  "Eat mindfully without distractions.",
  "Avoid eating when bored.",
  "Stretch your body after waking.",
  "Drink water before sleeping lightly.",
  "Avoid loud noises during sleep.",
  "Maintain calm breathing patterns.",
  "Limit sugary beverages intake.",
  "Avoid stress driven food habits.",
  "Practice slow morning routines.",
  "Avoid excessive late night work.",
  "Stay aware of hunger signals.",
  "Avoid skipping meals frequently.",
  "Practice good sleeping posture.",
  "Keep feet flat while sitting.",
  "Avoid eating large portions.",
  "Choose natural foods more often.",
  "Avoid excess oil in curries.",
  "Take short breaks while studying.",
  "Avoid staring at screens too long.",
  "Practice light exercises daily.",
  "Avoid dehydration during workouts.",
  "Eat protein in every meal.",
  "Avoid eating processed snacks.",
  "Keep meals simple and fresh.",
  "Practice good breathing habits.",
  "Avoid sudden heavy workouts.",
  "Maintain mental peace daily.",
  "Avoid eating late night snacks.",
  "Keep body movement regular.",
  "Avoid skipping warm up exercises.",
  "Drink water after physical activity.",
  "Avoid unhealthy coping habits.",
  "Practice mindful screen usage.",
  "Keep daily routine balanced.",
  "Avoid consuming stale food.",
  "Practice healthy lifestyle habits.",
  "Stay disciplined with sleep.",
  "Avoid excessive snacking habits.",
  "Eat slowly and mindfully.",
  "Avoid stress overload daily.",
  "Keep your body well nourished.",
  "Avoid prolonged inactivity periods.",
  "Practice calm and focused living."
]; 

// Password strength levels
export type PasswordStrength = "Weak" | "Medium" | "Strong";

/**
 * Check if password is STRONG (for final submit)
 * Rules:
 * - EXACTLY 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

/**
 * Get password strength level (for UI)
 * Weak   → 0–1 rules satisfied
 * Medium → 2–3 rules satisfied
 * Strong → All 4 rules satisfied
 */
export const getPasswordStrength = (
  password: string
): PasswordStrength => {
  if (!password) return "Weak";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score =
    Number(hasUpper) +
    Number(hasLower) +
    Number(hasNumber) +
    Number(hasSpecial);

  if (score === 4) return "Strong";
  if (score >= 2) return "Medium";

  return "Weak";
};


/**
 * Match password and confirm password
 */
export const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};


export const isValidDOB = (dob: string): boolean => {
  if (!dob) return false;

  const birthDate = new Date(dob);
  const today = new Date();

  return birthDate < today;
};

export const datePickerStyles = {
  month: {
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontWeight: 500,
    hoverBg: "#ccfbf1",
    selectedBg: "#0d9488",
    selectedColor: "#ffffff",
  },

  year: {
    borderRadius: "6px",
    fontSize: "14px",
    selectedBg: "#1e40af",
    selectedColor: "#ffffff",
  },

  date: {
    borderRadius: "50%",
    fontSize: "14px",
    hoverBg: "#e0f2fe",
    selectedBg: "#2563eb",
    selectedColor: "#ffffff",
    todayBorder: "1px solid #2563eb",
  },

  header: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};


export type Gender = "male" | "female" | "other";

// Allowed gender options
export const genderOptions: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "other" },
];

// Validate gender value
export const isValidGender = (gender: string): boolean => {
  return ["male", "female", "other"].includes(gender);
};

export type Role = "doctor" | "patient" | "admin";

export const getRoleFromUrl = (search: string): Role => {
  const params = new URLSearchParams(search);
  return (params.get("role") as Role) ?? "doctor";
};

// ================= AGE HELPERS =================

export const calculateAge = (dob: string): string => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age.toString();
};

export const isValidEmail = (email: string): boolean => {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone);
};

/* ================= GENDER MAP ================= */

export const GENDER_MAP: Record<string, string> = {
  "1": "Male",
  "2": "Female",
  "3": "Others",
};

export const bloodGroupMap: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

/* ================= HELPERS ================= */

export const getGenderLabel = (value?: string | number): string => {
  if (!value) return "—";
  return GENDER_MAP[String(value)] ?? "—";
};

export const urls ={
  baseUrl : 'http://localhost:4000/api/',
  loginUrl :'auth/login',
  signupUrl : 'auth/signup',
  sendOtpUrl: 'auth/send-otp',
  verifyOtpUrl: 'auth/verify-otp',
  resetPasswordUrl: 'auth/reset-password',
  profileurl : 'patient/profile',
  createAdminUrl : 'admin/create',
  getAllAdminsUrl: 'admin/alladmins',
  createDoctorUrl: 'doctor/create',
  getPendingDoctorsUrl: 'doctor/pending-doctors',
  updateDoctorStatusUrl: 'doctor/update-status',
  getDoctorListUrl: 'doctor/doctor-list',
  getpublicDoctorListUrl: 'doctor/public-doctor-list',
  applyDoctorUrl: 'apply-doctor',
  docProfileUrl: 'doctor/profile',
  adminProfileUrl: 'admin/profile',
  slotBookingUrl: 'doctor/slot-booking',
  dashboardCountUrl: '/dashboard-count',
  specializationCountUrl: '/specialization-count',
  deactiveAdminUrl: 'admin/deactivate-admin',
  deactiveDoctorUrl: '/doctor/deactivate-doctor',
  deleteAcoountUrl: '/account/deactivate',
  appointmentRequestUrl: '/appointment/create',
  appointmentsListUrl: '/appointment/list',
  pendingAppoinmentsUrl: '/appointment/pending-list',
  pendingappointmentsRequestUrl: '/appointment/update-status',
  cancelAppointmentsUrl: '/appointment/cancel-appointment',
  slotassignAppointmentUrl: '/appointment/assign-appointment-time',
  acknowledgementPdfUrl: '/acknowledgement'
}


/* ================= MENU ORDER BY ROLE ================= */

export const SIDE_NAV_CONTROLS: string[] = [
  "patient dashboard",
  "symptom checker",
  "my appointment",
  "patient appointments",
  "patient feedback",

  "admin dashboard",
  "create admin",
  "add doctor",
  "pending doctor list",
  "pending appointment",
  "admin list",
  "doctor list",
  "slot availability",
  "slot management",
  "admin aapointments",
  "messages",
  

  "doctor dashboard",
  "doctor appointment",
  "appointment requests",
  "doctor feedback",

  "feedback",
  "logout",
];

// menu ➜ route mapping
export const MENU_ROUTE_MAP: Record<string, string> = {
  "patient dashboard": "/patient",
  "symptom checker": "/patient/symptom_checker",
  "my appointment": "/patient/my_appointments",
  "patient appointments": "/patient/appointments",
  "patient feedback": "/patient/feedback",

  "doctor dashboard": "/doctor",
  "doctor appointment": "/doctor/appointments",
  "appointment requests": "/doctor/appointment_requests",
  "doctor feedback": "/doctor/doctor_feedback",

  "admin dashboard": "/admin",
  "create admin": "/admin/create_admin",
  "admin list": "/admin/admin_list",
  "pending doctor list": "/admin/pending_doctor_list",
  "pending appointment": "/admin/pending_appointment",
  "doctor list": "/admin/doctor_list",
  "messages": "/admin/messages",
  "add doctor": "/admin/add_doctor",
  "slot availability": "/admin/slot_availability",
  "slot management": "/admin/slot_management",
  "admin aapointments": "/admin/appointments",

  "logout": "/logout",
};


export const MENU_ICONS: Record<string, IconType> = {
  "patient dashboard": FiHome,
  "symptom checker": FiCheckSquare,
  "my appointment": FaCalendarCheck,
  "patient appointments": FiCalendar,
  "patient feedback": FiMessageSquare,

  "admin dashboard": FiHome,
  "create admin": FiUserPlus,
  "add doctor": FiUserPlus,
  "pending doctor list": FiUsers,
  "pending appointment": FiClock,
  "admin list": FiUsers,
  "doctor list": FiUsers,
  "slot availability": FiClock,
  "slot management": FiGrid,
  "admin aapointments": FiCalendar,
  "messages": FiMessageSquare,

  "doctor dashboard": FiHome,
  "doctor appointment": FiCalendar,
  "appointment requests": FiCalendar,
  "doctor feedback": FiMessageSquare,

  "feedback": FiMessageSquare,
  "logout": FiLogOut,
};

/* ================= GET ROUTE HELPER ================= */

export const getRoute = (controlKey: string): string => {
  return MENU_ROUTE_MAP[controlKey] || "/";
};



/* ================= GENDER OPTIONS ================= */

export const genderOption = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Others", value: 3 },
];

export const statusOption = [
  { label: "Active", value: 1},
  { label: "Inactive", value: 2},
];



/* ================= SPECIALIZATION OPTIONS ================= */

export const DOCTOR_SPECIALIZATIONS = [

  { label: "General Physician", value: 1, department: "General Medicine" },

  { label: "Cardiologist", value: 2, department: "Cardiology" },

  { label: "Dermatologist", value: 3, department: "Dermatology" },

  { label: "Pediatrician", value: 4, department: "Pediatrics" },

  { label: "General Surgeon", value: 5, department: "Surgery" },

  { label: "Dentist", value: 6, department: "Dental" },

  { label: "Ophthalmologist", value: 7, department: "Ophthalmology" },

  { label: "ENT Specialist", value: 8, department: "ENT" },

  { label: "Psychiatrist", value: 9, department: "Psychiatry" },

  { label: "Neurologist", value: 10, department: "Neurology" },

  { label: "Orthopedic", value: 11, department: "Orthopedics" },

  { label: "Gynecologist", value: 12, department: "Gynecology" }

];
