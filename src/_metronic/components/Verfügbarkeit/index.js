import React, { useCallback, useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import { toast } from "react-toastify";
import { ApiGet } from "../../../helpers/API/ApiData";
import { calculateDatePercentage, checkSubarrayLength, generateDateRange, getCurrentMonthDates, getEndDateOfMonth, groupDateRanges } from "./Functions";
import ConfirmationModal from "./Modal";
import "./Verfügbarkeit.scss";
import WorkingDays from "./WorkingDays";
let userInfo = JSON.parse(localStorage.getItem("userinfo"));

const Verfügbarkeit = () => {
  const weekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const months =  ["JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DEZEMBER"];
  const [values, setValues] = useState([]);
  const [isAvailable, setIsAvailable] = useState([]);
  const [notAvailable, setNotAvailable] = useState([]);
  const [isAvailableTravel, setIsAvailableTravel] = useState([]);
  const [modal, setModal] = useState(false);
  const [formattedDate, setFormattedDate] = useState([]);
  const { start, end } = getCurrentMonthDates();
  const [dates, setDates] = useState({ startDate: start, endDate: end });
  const [currentDatePercentage, setCurrentDatePercentage] = useState(0);

  const handleDatePercentage = (datesData) => {
    const currentMonth = new Date().getMonth() + 1;
    const apiMonth = new Date([...new Set(datesData?.flat())][0]).getMonth() + 1;
    const allRanges = datesData.map((range) => generateDateRange(range[0], range[1])).flat();
    if (!datesData?.length) {
      setCurrentDatePercentage(0)
    }
    if (currentMonth === apiMonth) {
      setCurrentDatePercentage(calculateDatePercentage([...new Set(allRanges)]));
    }
  };
  useEffect(() => {
    handleGetDates();
  }, [dates.startDate]);

  const dateIsAvailable = useCallback(
    (strDate) => {
      return isAvailable?.some(([start, end]) => strDate >= start && strDate <= end);
    },
    [isAvailable]
  );
  const dateNotAvailable = useCallback(
    (strDate) => {
      return notAvailable?.some(([start, end]) => strDate >= start && strDate <= end);
    },
    [notAvailable]
  );

  const dateIsAvailableTravel = useCallback((strDate) => {
    return isAvailableTravel.some(([start, end]) => strDate >= start && strDate <= end);
  });

  const handleGetDates = async () => {
    try {
      const response = await ApiGet(`dateSelect/getSelectDate?startDate=${dates.startDate}&endDate=${dates.endDate}${userInfo?._id ?`&_id=${userInfo?._id}`:""}`);

      const data = response?.data?.payload;
      if (!data) {
        throw new Error("No data received from API");
      }

      const isAvailable = data?.find((elem) => elem?.isAvailable);
      const dateNotAvailable = data?.find((elem) => elem?.isNotAvailable);
      const isAvailableTravel = data?.find((elem) => elem?.isAvailableTravel);

      const groupedAvailable = groupDateRanges(isAvailable?.date || []);
      const groupedDateNotAvailable = groupDateRanges(dateNotAvailable?.date || []);
      const groupedAvailableTravel = groupDateRanges(isAvailableTravel?.date || []);

      setIsAvailable(groupedAvailable);
      setIsAvailableTravel(groupedAvailableTravel);
      setNotAvailable(groupedDateNotAvailable)

      const initialValue = [...groupedAvailable, ...groupedAvailableTravel,...groupedDateNotAvailable];
      handleDatePercentage([...groupedAvailable, ...groupedAvailableTravel]);
      setValues(initialValue);
    } catch (error) {
      console.error("Error fetching dates:", error);
      toast.error(error.message || "Error fetching dates");
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      handleClear();
    }
  };
  const handleClear = () => {
    setValues(values.slice(0, -1));
    handleGetDates();
  };

  const handleOnDateChange = (ranges) => {
    if (checkSubarrayLength(ranges)) {
      toggle();
      const dateFormate = ranges.map((range) => [range[0]?.format?.("YYYY-MM-DD"), range[1]?.format?.("YYYY-MM-DD")]);
      setFormattedDate(dateFormate);
    }
    setValues(ranges);
  };
  return (
    <main className="main-content">
      <div className="Verfügbarkeit-page-all-content-alignment">
        <section>
          <div className="tittle">
            <h2>Verfügbarkeit</h2>
          </div>
          <div className="calendar">
            <Calendar
              // monthYearSeparator=""
              className="custom-calendar" 
              weekDays={weekDays}
              weekStartDayIndex={1}
              months={months}
              highlightToday={false}
              multiple
              range
              value={values}
              onMonthChange={(date) => {
                setDates({ startDate: date.format("YYYY-MM-DD"), endDate: getEndDateOfMonth(date.format("YYYY-MM-DD")) });
              }}
              onYearChange={(date) => setDates({ startDate: date.format("YYYY-MM-DD"), endDate: getEndDateOfMonth(date.format("YYYY-MM-DD")) })}
              onChange={(ranges) => handleOnDateChange(ranges)}
              mapDays={({ date }) => {
                let className;
                const strDate = date.format("YYYY-MM-DD");
                if (dateIsAvailable(strDate)) className = "Available";
                if (dateNotAvailable(strDate)) className = "not-available";
                if (dateIsAvailableTravel(strDate)) className = "ready-to-travel";
                if (className) return { className };
              }}
            />
            <div className="legend">
              <div className="un-availble">
                <div className="Available" />
                <p>Verfügbar</p>
              </div>
              <div className="un-availble">
                <div className="ready-to-travel" />
                <p>Verfügbar und reisebereit</p>
              </div>
              <div className="un-availble">
                <div className="not-available" />
                <p>Nicht verfügbar</p>
              </div>
            </div>
          </div>
        </section>
        <WorkingDays currentDatePercentage={currentDatePercentage} />
      </div>
      <ConfirmationModal isAvailableTravel={isAvailableTravel} isAvailable={isAvailable} handleGetDates={handleGetDates} formattedDate={formattedDate} handleClear={handleClear} modal={modal} toggle={toggle} />
    </main>
  );
};

export default Verfügbarkeit;