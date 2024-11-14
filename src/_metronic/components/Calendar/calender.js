import React, { useState, useEffect } from "react";
import "./Calendar.scss";
import { useHistory } from "react-router-dom";
import { ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import moment from "moment";
import { TailSpin } from "react-loader-spinner";

const CustomCalendar = ({
  ownMessage,
  leadStatus,
  leadData,
  meetingDate,
  type,
  appoinmentData,
  modal,
  setModal,
}) => {
  const [meetingdate, setMeetingData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isOpen, setIsOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false); // Added for end time
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedEndSlot, setSelectedEndSlot] = useState(""); // Added for end time
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [loading, setLoading] = useState(false);
  let error = {};
  const url = window.location.href;
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");

  useEffect(() => {
    if (meetingDate) {
      const utcDate = new Date(meetingDate.appointmentDate);
      const newutcData=new Date(meetingDate.appointmentEndTime)
      const localDate = moment.utc(utcDate).local();
      const newlocalDate = moment.utc(newutcData).local();

      const formattedDate = localDate.format("D/M/YYYY");
      const newFormattedDate = localDate.format("YYYY-MM-DD");

      setMeetingData(formattedDate);
      setSelectedDate(newFormattedDate);
      setSelectedSlot(localDate.format("HH:mm"));
      setSelectedEndSlot(newlocalDate.format("HH:mm"))
    }
  }, [meetingDate]);


  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysArray = Array.from({ length: 42 }, (_, i) => {
      const dayNumber = i - adjustedFirstDayIndex + 1;
      return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
    });

    setDays({ daysArray });
  }, [month, year]);

  const [days, setDays] = useState({
    daysArray: [],
  });

  const { daysArray } = days;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setMonth((prev) => {
      if (prev === 0) {
        setYear((prevYear) => prevYear - 1);
        return 11;
      } else {
        return prev - 1;
      }
    });
  };

  const handleNextMonth = () => {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((prevYear) => prevYear + 1);
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  const handleDateClick = (day) => {
    if (day) {
      const selectedDateObj = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDateObj.setHours(0, 0, 0, 0);

      if (selectedDateObj >= today) {
        const selectedData = `${day}/${month + 1}/${year}`;
        setMeetingData(selectedData);
        setSelectedDate(selectedDateObj);
      }
    }
  };

  const generateTimeSlots = (selectedDateStr, minTime = 7 * 60) => {
    const slots = [];
    const endTime = 22 * 60;
  
    const formatTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const displayHours = hours < 10 ? `0${hours}` : hours;
      const displayMinutes = mins < 10 ? `0${mins}` : mins;
      return `${displayHours}:${displayMinutes}`;
    };
  
    const [day, month, year] = selectedDateStr.split("/").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
    const isToday = selectedDate.toDateString() === currentDate.toDateString();
  
    while (minTime < endTime) {
      if (!isToday || minTime >= currentMinutes) {
        const timeSlot = formatTime(minTime);
        slots.push(timeSlot);
      }
      minTime += 15;
    }
  
    return slots;
  };
  
  const todayDate = moment();
  const ourNewMeetingDate = todayDate.format("D/M/YYYY");
  const sendDate = meetingdate.length > 0 ? meetingdate : ourNewMeetingDate;
  const timeSlots = generateTimeSlots(sendDate);
  
  const startMinutes = selectedSlot ? (parseInt(selectedSlot.split(":")[0]) * 60 + parseInt(selectedSlot.split(":")[1])) : 0;
  
  const endTimeSlots = selectedSlot
    ? generateTimeSlots(sendDate)
    : [];
  

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEndToggle = () => {
    setIsEndOpen(!isEndOpen);
  };

  const handleSelect = (slot) => {
    
    setSelectedSlot(slot);
    setIsOpen(false);
    setSelectedEndSlot(""); 
  };

  const handleEndSelect = (slot) => {
    setSelectedEndSlot(slot);
    setIsEndOpen(false);
  };

  const validation = () => {
    let isValid = true;
    if (!selectedSlot || !selectedEndSlot || meetingdate?.length < 1) {
      toast.error("Bitte wählen Sie ein Datum und einen gültigen Zeitrahmen aus");
      isValid = false;
    }
    return isValid;
  };

  const handleSchedualMeeting = async () => {
    if (validation()) {
      const dateData = meetingdate;
      const timeSlotData = selectedSlot;
      
      const endTimeSlotData = selectedEndSlot;
      const [day, newmonth, newyear] = dateData.split("/").map(Number);
      const [hours, minutes] = timeSlotData.split(":").map(Number);
      const [endHours, endMinutes] = endTimeSlotData.split(":").map(Number);

      const localDateObj = new Date(newyear, newmonth - 1, day, hours, minutes);
    
      const localEndDateObj = new Date(newyear, newmonth - 1, day, endHours, endMinutes);
     

      const utcDate = localDateObj.toISOString();
      const utcEndDate = localEndDateObj.toISOString();


   

      try {
        if (type === "update") {
          const body = {
            appointmentDate: utcDate,
            appointmentEndTime: utcEndDate, 
          };
          setLoading(true);
          let response = await ApiPut(
            `vattenfall/updateAppointment?id=${meetingDate?._id}`,
            body
          );
          if (response) {
            let body = {
              status: leadStatus,
              leadNotes: ownMessage,
            };
            try {
              let resp = await ApiPut(
                `vattenfall/updateLeadVatten${id ? `?id=${id}` : ""}`,
                body
              );
              toast.success("Das geplante Meeting wurde erfolgreich aktualisiert.");
             window.location.reload()
              setLoading(false);
            } catch (error) {
              toast.error("Failed to update lead status");
              console.log(error);
              setLoading(false);
            }
          }
        } else {
          const body = {
            appointmentDate: utcDate,
            appointmentEndTime: utcEndDate, 
            leadId: leadData?._id,
            uid: userInfo?._id,
          };
          setLoading(true);
          let response = await ApiPost(`vattenfall/addAppointment`, body);
          if (response) {
            let body = {
              status: `TERMINIERT (${appoinmentData?.length + 1})`,
              leadNotes: ownMessage,
            };
            try {
              let resp = await ApiPut(
                `vattenfall/updateLeadVatten${ `?id=${id ?id :leadData?._id}` }`,
                body
              );
              toast.success("Meeting erfolgreich geplant");
              window.location.reload()
              setLoading(false);
            } catch (error) {
              toast.error("Failed to update lead status");
              console.log(error);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        toast.error("Fehler bei der Planung des Meetings");
        setLoading(false);
        console.log(error);
      }
    }
  };
  

  return (
    <>
      <div className="calendar-app-layout">
        {history?.location?.pathname === "/calendar" ? (
          <div className="termine-title">
            <h1>Termine</h1>
            <span></span>
          </div>
        ) : (
          <div className="header-title-design">
            <h1>
            { `Terminierung "${leadData?.name} ${leadData?.nachname}" in "${leadData?.location}" errreichbar unter:
                "${leadData?.telephon}"`}
            </h1>

            <p onClick={()=>setModal(!modal)}><svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.79325 0.736327L1.47656 5.77246L5.79325 10.8086"
                    stroke="#1F1F21"
                    strokeWidth="1.27902"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>zurück</p>
          </div>
        )}

        <div className="calendar-app">
          <div className="calendar">
            <div className="month-controls">
              <button onClick={handlePrevMonth} className="prev">
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.79325 0.736327L1.47656 5.77246L5.79325 10.8086"
                    stroke="#1F1F21"
                    strokeWidth="1.27902"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="month-label">
                {monthNames[month]} {year}
              </span>
              <button onClick={handleNextMonth} className="next">
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.20675 10.8105L5.52344 5.77441L1.20675 0.738282"
                    stroke="#1F1F21"
                    strokeWidth="1.27902"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="weekdays">
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
              <div>SUN</div>
            </div>
            <div className="days">
              {daysArray.map((day, index) => {

                const dayDate = new Date(year, month, day);
                const isPastDate = dayDate < new Date().setHours(0, 0, 0, 0);
                const isSelectedDate =
                  selectedDate &&
                  moment(dayDate).format("YYYY-MM-DD") ===
                    moment(selectedDate).format("YYYY-MM-DD");
                return (
                  <div
                    key={index}
                    className={`current-month ${
                      day
                        ? isPastDate
                          ? "past-date"
                          : isSelectedDate
                          ? "selected-date"
                          : ""
                        : "empty"
                    }`}
                    onClick={() => !isPastDate && day && handleDateClick(day)}
                  >
                    <div className="calender-date-alignment">
                      <div
                        className={
                          !isSelectedDate
                            ? ` clender-date-circle`
                            : `clender-date-circle-selected`
                        }
                      >
                        <p>{day !== null ? day : ""}</p>
                      </div>
                    </div>
                    <div className="Date-data"></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="Calender-time-div-main">
  
{/* Start Time Dropdown */}
<div className="custom-dropdown">
  <div className="dropdown-header" onClick={handleToggle}>
    {selectedSlot || "Termin Beginn"}
    <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
      ▼
    </span>
  </div>
  {isOpen && (
    <div className="custom-dropdown-menu-main">
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          className="dropdown-item"
          onClick={() => {
            handleSelect(slot);
            setIsEndOpen(true); // Show the end time dropdown after start time is selected
          }}
        >
          {slot}
        </div>
      ))}
    </div>
  )}
</div>

{/* End Time Dropdown - Initially hidden until start time is selected */}
{selectedSlot && (
  <div className="custom-dropdown">
    <div className="dropdown-header" onClick={handleEndToggle}>
      {selectedEndSlot || "Termin Ende"}
      <span className={`dropdown-arrow ${isEndOpen ? "open" : ""}`}>
        ▼
      </span>
    </div>
    {isEndOpen && (
      <div className="custom-dropdown-menu-main">
        {endTimeSlots.map((slot, index) => {
          const slotMinutes = parseInt(slot.split(":")[0]) * 60 + parseInt(slot.split(":")[1]);
          const isDisabled = slotMinutes <= startMinutes;
          return (
            <div
              key={index}
              className={`dropdown-item ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleEndSelect(slot)}
            >
              {slot}
            </div>
          );
        })}
      </div>
    )}
  </div>
)}



            <button onClick={() => handleSchedualMeeting()}>
              {loading ? (
                <TailSpin color="#FFF" height={25} width={25} />
              ) : (
               <>Terminieren &  <br/>Einladung senden</> 
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;
