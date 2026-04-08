import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { MdAccessTime, MdCalendarToday } from "react-icons/md";
import { HiArrowsUpDown } from "react-icons/hi2";
import toast from "react-hot-toast";

import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchAppointmentsThunk } from "../../../../store/slices/appointmentSlice";
import { slotassignAppointmentApi } from "../../../services/appointmentApi";
import type { Appointment } from "../../../services/appointmentApi";

/* ================= COLUMN KEY TYPE ================= */

type ColumnKey =
  | "appointment_id"
  | "patient_name"
  | "doctor_name"
  | "appointment_date"
  | "slot_time"
  | "appointment_time"
  | "status"
  | "action";



const Slotmanagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointment
  );

  const ROW_COLORS = [
    "bg-gray-100 hover:bg-gray-200 dark:bg-gray-400/60",
    "bg-gray-50 hover:bg-gray-200 dark:bg-gray-300/100",
  ];

  const [search, setSearch] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  /* appointment time */
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  /* calendar */
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [tempSelectedDate, setTempSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  /* ================= COLUMN WIDTH STATE ================= */

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
    appointment_id: 200,
    patient_name: 250,
    doctor_name: 250,
    appointment_date: 200,
    slot_time: 180,
    appointment_time: 180,
    status: 150,
    action: 150,
  });

  const resizingCol = useRef<ColumnKey | null>(null);

  const startResize = (
    _e: React.MouseEvent<HTMLDivElement>,
    column: ColumnKey
  ) => {
    resizingCol.current = column;
  };

  const stopResize = () => {
    resizingCol.current = null;
  };

  const resize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!resizingCol.current) return;

    setColumnWidths((prev) => ({
      ...prev,
      [resizingCol.current!]: prev[resizingCol.current!] + e.movementX,
    }));
  };

  /* ================= HELPERS ================= */

  const convertTo24Hour = (hour: string, minute: string, period: string) => {
    let hh = parseInt(hour, 10);

    if (period === "AM") {
      if (hh === 12) hh = 0;
    } else {
      if (hh !== 12) hh += 12;
    }

    return `${String(hh).padStart(2, "0")}:${minute}:00`;
  };

  const convertToAMPM = (time?: string | null) => {
    if (!time) return "";

    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);

    const meridian = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, "0")}:${m} ${meridian}`;
  };

  const parseTime = (time: string) => {
    const [hm, period] = time.split(" ");
    const [h, m] = hm.split(":");

    return {
      hour: parseInt(h, 10),
      minute: parseInt(m, 10),
      period: period as "AM" | "PM",
    };
  };

  const getSlotHourOptions = (
    startTime?: string | null,
    endTime?: string | null
  ) => {
    if (!startTime || !endTime) return [];

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    const options: { hour: string; period: "AM" | "PM" }[] = [];

    const to24 = (h: number, p: "AM" | "PM") => {
      if (p === "AM") return h === 12 ? 0 : h;
      return h === 12 ? 12 : h + 12;
    };

    const start24 = to24(start.hour, start.period);
    const end24 = to24(end.hour, end.period);

    for (let h24 = start24; h24 < end24; h24++) {
      const optionPeriod: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
      const optionHour12 = h24 % 12 === 0 ? 12 : h24 % 12;

      options.push({
        hour: String(optionHour12).padStart(2, "0"),
        period: optionPeriod,
      });
    }

    return options;
  };

  /* ================= FETCH APPOINTMENTS ================= */

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    dispatch(fetchAppointmentsThunk());
  }, [dispatch]);

  /* ================= HANDLERS ================= */

  const handleDateClick = (fullDate: string) => {
    setTempSelectedDate(fullDate);
    setShowConfirmModal(true);
  };

  const handleConfirmDate = () => {
    setSelectedDate(tempSelectedDate);
    setShowConfirmModal(false);
    setIsCalendarOpen(false);
  };

  const handleCancelDate = () => {
    setShowConfirmModal(false);
    setTempSelectedDate("");
  };

  const handleOpenSlotModal = (appointment: Appointment) => {
    const selectedApp = appointment as Appointment;
    setSelectedAppointment(selectedApp);

    const slotHourOptions = getSlotHourOptions(
      selectedApp.start_time,
      selectedApp.end_time
    );

    if (appointment.appointment_time) {
      const timeValue = appointment.appointment_time.trim();

      if (timeValue.includes("AM") || timeValue.includes("PM")) {
        const [time, meridian] = timeValue.split(" ");
        const [hh, mm] = time.split(":");
        setHour(hh.padStart(2, "0"));
        setMinute(mm.padStart(2, "0"));
        setPeriod(meridian as "AM" | "PM");
      } else {
        const [h, m] = timeValue.split(":");
        let hourNum = parseInt(h, 10);
        const meridian = hourNum >= 12 ? "PM" : "AM";
        hourNum = hourNum % 12 || 12;

        setHour(String(hourNum).padStart(2, "0"));
        setMinute((m || "00").padStart(2, "0"));
        setPeriod(meridian);
      }
    } else if (slotHourOptions.length > 0) {
      setHour(slotHourOptions[0].hour);
      setMinute("00");
      setPeriod(slotHourOptions[0].period);
    } else {
      setHour("01");
      setMinute("00");
      setPeriod("AM");
    }

    setShowSlotModal(true);
  };

  const handleCloseSlotModal = () => {
    setShowSlotModal(false);
    setSelectedAppointment(null);
    setHour("01");
    setMinute("00");
    setPeriod("AM");
  };

  const handleSaveAppointmentTime = async () => {
    try {
      if (!selectedAppointment?.appointment_id) {
        toast.error("Appointment not found");
        return;
      }

      const appointment_time = convertTo24Hour(hour, minute, period);

      const response = await slotassignAppointmentApi({
        appointment_id: selectedAppointment.appointment_id,
        appointment_time,
      });

      if (response?.data?.success) {
        toast.success(
          response.data.message || "Appointment time assigned successfully"
        );
        handleCloseSlotModal();
        dispatch(fetchAppointmentsThunk());
      } else {
        toast.error(
          response?.data?.message || "Failed to assign appointment time"
        );
      }
    } catch (error) {
      console.error("SAVE APPOINTMENT TIME ERROR:", error);
      toast.error("Something went wrong while saving appointment time");
    }
  };

  /* ================= FILTER APPOINTMENTS ================= */

  const filteredAppointments: Appointment[] = (
    Array.isArray(appointments) ? appointments : []
  )
    .filter((appointment) => {
      const statusName = appointment.booking_status || "";
      const patientName = appointment.patient_name || "";
      const doctorName = appointment.doctor_name || "";
      const appointmentDate = appointment.appointment_date || "";
      const appointmentNo = appointment.appointment_no || "";

      const normalizedAppointmentDate =
        typeof appointmentDate === "string" && appointmentDate.includes("T")
          ? appointmentDate.split("T")[0]
          : appointmentDate;

      const matchesDate =
        !selectedDate || normalizedAppointmentDate === selectedDate;

      const matchesSearch =
        !search ||
        String(appointment.appointment_id || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(patientName).toLowerCase().includes(search.toLowerCase()) ||
        String(doctorName).toLowerCase().includes(search.toLowerCase()) ||
        String(appointmentDate).toLowerCase().includes(search.toLowerCase()) ||
        String(appointmentNo).toLowerCase().includes(search.toLowerCase()) ||
        String(statusName).toLowerCase().includes(search.toLowerCase());

      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a.appointment_date
        ? new Date(a.appointment_date).getTime()
        : 0;
      const dateB = b.appointment_date
        ? new Date(b.appointment_date).getTime()
        : 0;

      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const slot =
    selectedAppointment?.start_time && selectedAppointment?.end_time
      ? {
          start: parseTime(selectedAppointment.start_time),
          end: parseTime(selectedAppointment.end_time),
        }
      : null;

  const slotHourOptions = getSlotHourOptions(
    selectedAppointment?.start_time,
    selectedAppointment?.end_time
  );

  let minuteStart = 0;
  let minuteEnd = 59;

  if (slot) {
    const selectedHourNum = parseInt(hour, 10);
    const selectedHourWithPeriod = slotHourOptions.find(
      (h) => h.hour === hour && h.period === period
    );

    if (selectedHourWithPeriod) {
      const isFirstSlotHour =
        selectedHourWithPeriod.hour === slotHourOptions[0]?.hour &&
        selectedHourWithPeriod.period === slotHourOptions[0]?.period;

      const lastSlotHour = slotHourOptions[slotHourOptions.length - 1];
      const isLastSlotHour =
        selectedHourWithPeriod.hour === lastSlotHour?.hour &&
        selectedHourWithPeriod.period === lastSlotHour?.period;

      if (isFirstSlotHour) {
        minuteStart = slot.start.minute;
      }

      if (isLastSlotHour) {
        minuteEnd = slot.end.minute;
      }
    }

    if (selectedHourNum < 1 || selectedHourNum > 12) {
      minuteStart = 0;
      minuteEnd = 59;
    }
  }

  return (
    <div
      className="p-6 bg-gradient-to-r from-slate-300 via-cyan-100 to-slate-300 dark:from-cyan-900 dark:via-slate-700 dark:to-cyan-900 min-h-screen"
      onMouseMove={resize}
      onMouseUp={stopResize}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-cyan-700 dark:text-gray-300">
          Slot Management
        </h2>
      </div>

      <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
            >
              <HiArrowsUpDown className="text-cyan-700 dark:text-gray-100 w-5 h-5" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-gray-100">
                Sort
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1 px-3 py-2 ml-1 border border-cyan-600 dark:border-gray-200 rounded-4xl backdrop-blur-md bg-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/20 transition"
          >
            <MdCalendarToday className="text-cyan-700 dark:text-gray-100 w-4 h-4" />
          </button>

          <div className="flex items-center ml-auto gap-2">
            <div className="flex items-center w-[400px] border border-cyan-600 dark:border-gray-200 rounded-full px-4 py-2 shadow-sm backdrop-blur-md">
              <input
                type="text"
                placeholder="Search by name, no, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-700 dark:placeholder-gray-200"
              />
              <FaSearch className="text-cyan-700 dark:text-gray-200 text-lg mr-2" />
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="mb-4 text-sm font-medium text-cyan-800 dark:text-gray-200">
            Selected Date: {selectedDate}
          </div>
        )}

        {isCalendarOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-40">
            <div className="bg-white w-[600px] rounded-2xl p-6 border shadow-lg">
              <div className="flex justify-between mb-4">
                <div className="text-lg font-semibold text-cyan-700">
                  Select Date
                </div>
                <button
                  onClick={() => {
                    setIsCalendarOpen(false);
                    setShowConfirmModal(false);
                    setTempSelectedDate("");
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="border rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <button
                    onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  >
                    ◀
                  </button>

                  <h3>
                    {monthName} {year}
                  </h3>

                  <button
                    onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  >
                    ▶
                  </button>
                </div>

                <div className="grid grid-cols-7 text-sm text-gray-400 text-center mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {[...Array(firstDay)].map((_, i) => (
                    <div key={i}></div>
                  ))}

                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;

                    const fullDate = `${year}-${String(month + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;

                    const isToday = fullDate === todayDate;
                    const isSelected = fullDate === selectedDate;
                    const isTempSelected = fullDate === tempSelectedDate;

                    return (
                      <div
                        key={day}
                        className={`min-h-[50px] flex flex-col items-center justify-center border rounded-lg cursor-pointer transition
                          ${
                            isSelected
                              ? "bg-cyan-600 text-white"
                              : isTempSelected
                              ? "bg-cyan-200 text-cyan-900"
                              : isToday
                              ? "bg-cyan-50 border-cyan-400"
                              : "hover:bg-cyan-100"
                          }`}
                        onClick={() => handleDateClick(fullDate)}
                      >
                        <span>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedDate("");
                    setTempSelectedDate("");
                  }}
                  className="px-4 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[360px] rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Select Date
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Show appointments for{" "}
                <span className="font-semibold">{tempSelectedDate}</span>?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelDate}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDate}
                  className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}

        {showSlotModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded-2xl p-5 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl pl-1 font-semibold text-cyan-700">
                  Appointment Time
                </h3>
                <button
                  onClick={handleCloseSlotModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-sm pl-1 text-gray-700">
                <p>
                  <span className="font-semibold">Appointment No:</span>{" "}
                  {selectedAppointment.appointment_no || "-"}
                </p>

                <p>
                  <span className="font-semibold">Patient Name:</span>{" "}
                  {selectedAppointment.patient_name || "-"}
                </p>

                <p>
                  <span className="font-semibold">Doctor Name:</span>{" "}
                  {selectedAppointment.doctor_name || "-"}
                </p>

                <p>
                  <span className="font-semibold">Appointment Date:</span>{" "}
                  {selectedAppointment.appointment_date || "-"}
                </p>

                <p>
                  <span className="font-semibold">Slot Time:</span>{" "}
                  {selectedAppointment.doc_slot || "-"}
                </p>
              </div>

              <div className="bg-cyan-600 h-px w-full mt-3"></div>

              <div className="flex items-center text-sm text-gray-700 mb-3 mt-4">
                <span className="font-semibold w-40 pl-1">
                  Appointment Time :
                </span>

                <div className="flex gap-1 border shadow-md rounded-sm p-1 mt-2 items-center">
                  <select
                    value={hour}
                    onChange={(e) => {
                      const selectedHour = e.target.value;
                      setHour(selectedHour);

                      const selectedOption = slotHourOptions.find(
                        (opt) => opt.hour === selectedHour
                      );

                      if (selectedOption) {
                        setPeriod(selectedOption.period);
                      }
                    }}
                    className="outline-none bg-transparent"
                  >
                    {slotHourOptions.length > 0
                      ? slotHourOptions.map((hObj, index) => (
                          <option key={`${hObj.hour}-${hObj.period}-${index}`} value={hObj.hour}>
                            {hObj.hour}
                          </option>
                        ))
                      : [...Array(12)].map((_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, "0")}>
                            {i + 1}
                          </option>
                        ))}
                  </select>

                  <span>:</span>

                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="outline-none bg-transparent"
                  >
                    {Array.from(
                      { length: minuteEnd - minuteStart + 1 },
                      (_, i) => minuteStart + i
                    ).map((m) => (
                      <option key={m} value={String(m).padStart(2, "0")}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as "AM" | "PM")}
                    className="outline-none bg-transparent"
                  >
                    {slotHourOptions.length > 0 ? (
                      Array.from(new Set(slotHourOptions.map((h) => h.period))).map(
                        (p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        )
                      )
                    ) : (
                      <>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseSlotModal}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveAppointmentTime}
                  className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md">
          <div className="max-h-[450px] overflow-y-auto rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-cyan-600 text-gray-100 text-sm sticky top-0 z-10">
                <tr className="divide-x divide-gray-100">
                  <th
                    style={{ width: columnWidths.appointment_id }}
                    className="p-4 relative"
                  >
                    Appointment No.
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_id")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.patient_name }}
                    className="p-4 relative"
                  >
                    Patient Name
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "patient_name")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.doctor_name }}
                    className="p-4 relative"
                  >
                    Doctor Name
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "doctor_name")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.appointment_date }}
                    className="p-4 relative"
                  >
                    Appointment Date
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_date")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.slot_time }}
                    className="p-4 relative"
                  >
                    Slot Time
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "slot_time")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.appointment_time }}
                    className="p-4 relative"
                  >
                    Appointment Time
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "appointment_time")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.status }}
                    className="p-4 relative"
                  >
                    Status
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "status")}
                    />
                  </th>

                  <th
                    style={{ width: columnWidths.action }}
                    className="p-4 relative"
                  >
                    Action
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => startResize(e, "action")}
                    />
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {loading && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading && filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredAppointments.map((app, index) => {
                    const color = ROW_COLORS[index % ROW_COLORS.length];

                    return (
                      <tr
                        key={app.appointment_id}
                        className={`border-b border-gray-300 items-center ${color} transition duration-200`}
                      >
                        <td className="p-4">
                          <div className="flex gap-2 justify-center items-center">
                            {app.appointment_no || "-"}
                          </div>
                        </td>

                        <td className="p-4">{app.patient_name || "-"}</td>

                        <td className="p-4">{app.doctor_name || "-"}</td>

                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            {app.appointment_date || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            {app.doc_slot || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            {app.appointment_time
                              ? convertToAMPM(app.appointment_time)
                              : "Not Generated"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            {app.booking_status || "-"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleOpenSlotModal(app)}
                              type="button"
                              className="text-blue-600 hover:text-blue-800 p-2 bg-blue-100 rounded-full hover:bg-blue-200"
                              title="Assign Appointment Time"
                            >
                              <MdAccessTime className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slotmanagement;