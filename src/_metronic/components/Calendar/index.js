import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { TailSpin } from "react-loader-spinner";
import "./Calendar.scss";
import moment from "moment";
import { ApiGet } from "../../../helpers/API/ApiData";

const Calendar = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [leadData, setLeadDate] = useState();
  const columns = [
    {
      name: <span>No</span>,
      cell: (row, index) => {
        return (
          <p style={{ paddingLeft: "5px", paddingTop: "12px" }}>{index + 1}</p>
        );
      },
      width: "90px",
    },
    {
      name: <span>Kunde</span>,
      width: "300px",
      selector: (row) => (
        <div className="profileImage">
          {row.leadId ? row?.leadId?.name + " " + row?.leadId?.nachname : "-"}
        </div>
      ),
    },
    {
      name: <span>Adresse</span>,
      selector: (row) => (
        <div className="profileImage">
          {row?.leadId
            ? row?.leadId.strabe +
              " " +
              row?.leadId?.pLZ +
              " " +
              row?.leadId?.location
            : "-"}
        </div>
      ),
    },
    {
      name: <span>Status</span>,
      width: "250px",
      selector: (row) => {
        const statusClass =
          row?.leadId?.status == "offen" ||
          row?.leadId?.status == "NICHT ERREICHT" ||
          row?.leadId?.status == "ZEITLICHE VERZÖGERUNG"
          || row?.leadId?.status=="SPÄTER ANRUFEN"
            ? "new-deisgnpppppppppp"
            : row?.leadId?.status == "STORNO"
            ? "new-deisgn-statusooooooooooo"
            : "newstatusppppppppppp";

        return (
          <div className={statusClass}>
            {row?.leadId?.status ? row?.leadId?.status?.toUpperCase() : "-"}
          </div>
        );
      },
    },
    {
      name: "Uhrzeit",
      selector: (row) => {
        const appointmentDate = moment(row.appointmentDate).local();
        const isPast = appointmentDate.isBefore(moment());

        return (
          <div className="profileImage table-icon-alignment">
            <p>{row.appointmentDate ? appointmentDate.format("HH:mm") : "-"}</p>
            {!isPast && row?.leadId?.status !== "VERKAUFT" && (
              <NavLink to={`/vattenlead?id=${row?.leadId?._id}`}>
                <div className="icon-svg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-0.0078125 13.2069V15.4998C-0.0078125 15.6325 0.044866 15.7596 0.138634 15.8534C0.232402 15.9472 0.359579 15.9998 0.492188 15.9998H2.79019C2.92254 15.9998 3.04948 15.9473 3.14319 15.8538L12.5912 6.40585L9.59119 3.40585L0.139188 12.8538C0.0453521 12.9474 -0.00751912 13.0744 -0.0078125 13.2069ZM10.8292 2.16685L13.8292 5.16685L15.2892 3.70685C15.4767 3.51932 15.582 3.26501 15.582 2.99985C15.582 2.73468 15.4767 2.48038 15.2892 2.29285L13.7042 0.706849C13.5167 0.519378 13.2624 0.414062 12.9972 0.414062C12.732 0.414062 12.4777 0.519378 12.2902 0.706849L10.8292 2.16685Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </NavLink>
            )}
          </div>
        );
      },
    },
  ];
  const columnsTablet = [
    {
      name: <span>No</span>,
      cell: (row, index) => {
        return (
          <p style={{ paddingLeft: "5px", paddingTop: "12px" }}>{index + 1}</p>
        );
      },
      width: "60px",
    },
    {
      name: <span>Kunde</span>,
      width: "150px",
      selector: (row) => (
        <div className="profileImage">
          {" "}
          {row.leadId ? row?.leadId?.name + " " + row?.leadId?.nachname : "-"}
        </div>
      ),
    },
    {
      name: <span>Adresse</span>,
      selector: (row) => (
        <div className="profileImage">
          {" "}
          {row?.leadId
            ? row?.leadId.strabe +
              " " +
              row?.leadId?.pLZ +
              " " +
              row?.leadId?.location
            : "-"}
        </div>
      ),
    },
    {
      name: <span>Status</span>,
      width: "250px",
      selector: (row) => {
        const statusClass =
          row?.leadId?.status == "offen" ||
          row?.leadId?.status == "NICHT ERREICHT" ||
          row?.leadId?.status == "ZEITLICHE VERZÖGERUNG"|| row?.leadId?.status=="SPÄTER ANRUFEN"
            ? "new-deisgnpppppppppp"
            : row?.leadId?.status == "STORNO"
            ? "new-deisgn-statusooooooooooo"
            : "newstatusppppppppppp";

        return (
          <div className={statusClass}>
            {row?.leadId?.status ? row?.leadId?.status?.toUpperCase() : "-"}
          </div>
        );
      },
    },
    {
      name: "Uhrzeit",
      selector: (row) => {
        const appointmentDate = moment(row?.appointmentDate).local();
        const isPast = appointmentDate.isBefore(moment());

        return (
          <div className="profileImage table-icon-alignment">
            <p>
              {row?.appointmentDate ? appointmentDate?.format("HH:mm") : "-"}
            </p>
            {!isPast && row?.leadId?.status !== "VERKAUFT" && (
              <NavLink to={`/vattenlead?id=${row?.leadId?._id}`}>
                <div className="icon-svg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-0.0078125 13.2069V15.4998C-0.0078125 15.6325 0.044866 15.7596 0.138634 15.8534C0.232402 15.9472 0.359579 15.9998 0.492188 15.9998H2.79019C2.92254 15.9998 3.04948 15.9473 3.14319 15.8538L12.5912 6.40585L9.59119 3.40585L0.139188 12.8538C0.0453521 12.9474 -0.00751912 13.0744 -0.0078125 13.2069ZM10.8292 2.16685L13.8292 5.16685L15.2892 3.70685C15.4767 3.51932 15.582 3.26501 15.582 2.99985C15.582 2.73468 15.4767 2.48038 15.2892 2.29285L13.7042 0.706849C13.5167 0.519378 13.2624 0.414062 12.9972 0.414062C12.732 0.414062 12.4777 0.519378 12.2902 0.706849L10.8292 2.16685Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </NavLink>
            )}
          </div>
        );
      },
    },
  ];

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

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysArray = Array.from({ length: 42 }, (_, i) => {
      const dayNumber = i - adjustedFirstDayIndex + 1;
      return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
    });

    setDays({
      daysArray,
    });
  }, [month, year]);

  const handleDateClick = async (day) => {
    if (day) {
      const selectedDateObj = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDateObj.setHours(0, 0, 0, 0);
      setSelectedDate(selectedDateObj);
    }
  };

  const getDataByDate = async () => {
    let formatedDate = moment(selectedDate).format("YYYY-MM-DD");
    try {
      setLoading(true);
      let resp = await ApiGet(
        `vattenfall/getSelectDateLead?startDate=${formatedDate}&endDate=${formatedDate}`
      );
      setCount(resp?.data?.payload?.count);
      setLeadDate(resp?.data?.payload?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataByDate();
  }, [selectedDate]);
  const customNoDataComponent = () => (
    <div
      style={{
        height: "150px",
        textAlign: "center",
        padding: "60px 0px 10px  0px",
        fontSize: "16px",
      }}
    >
      Du hast in diesem Zeitraum noch keine Termine
    </div>
  );

 
 
  const [daysWithAppointments, setDaysWithAppointments] = useState([]);
 
  const getDataofThisMonth = async () => {
    const firstDayOfMonth = new Date(year, month, 1); 
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDateFormatted = moment(firstDayOfMonth).format("YYYY-MM-DD");
  const lastDateFormatted = moment(lastDayOfMonth).format("YYYY-MM-DD");
    try {
      setLoading(true);
      let resp = await ApiGet(
        `vattenfall/getSelectDateLead?startDate=${firstDateFormatted}&endDate=${lastDateFormatted}`
      );
      const appointments = resp?.data?.payload?.data || [];
     
      let daysOfMonth = [];
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = moment(new Date(year, month, day)).format("YYYY-MM-DD");
        const hasAppointment = appointments.some(appointment => {
          const appointmentDate = moment(appointment.appointmentDate).format("YYYY-MM-DD");
          return appointmentDate === currentDate;
        });
        daysOfMonth.push({ date: currentDate, hasAppointment });
      }

      setDaysWithAppointments(daysOfMonth);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    getDataofThisMonth()
  },[month,year])
  return (
    <>
      {" "}
      <div className="calendar-app-layout">
        <div className="termine-title">
          <h1>Termine</h1>
          <span></span>
        </div>

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
                const formattedDay = moment(dayDate).format("YYYY-MM-DD");
                const isSelectedDate =
                  selectedDate &&
                  moment(dayDate).format("YYYY-MM-DD") ===
                    moment(selectedDate).format("YYYY-MM-DD");
                    const appointmentData = daysWithAppointments?.find(
                      (appointment) => appointment?.date === formattedDay
                    );
                    const hasAppointment = appointmentData ? appointmentData.hasAppointment : false
                return (
                  <div
                    key={index}
                    className={`current-month ${
                      day ? (isSelectedDate ? "selected-date" : "") : "empty"
                    }`}
                    onClick={() => day && handleDateClick(day)}
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
                        {hasAppointment && (
                          <i class="fa-solid fa-house"></i>
                        )}
                      </div>
                    </div>
                    <div className="Date-data"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="projekte-datatable-ppppp">
        <DataTable
          className="dats-tatasaddd"
          columns={columns}
          data={leadData}
          responsive
          noDataComponent={customNoDataComponent()}
          pagination
          paginationServer
          paginationTotalRows={count}
          paginationPerPage={countPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 25, 50]}
          paginationDefaultPage={page}
          progressPending={loading}
          progressComponent={
            <div className="LoadinComponent">
              <TailSpin color="#334D52" height={30} width={30} />
            </div>
          }
          onChangePage={(page) => {
            setPage(page);
          }}
          onChangeRowsPerPage={(rowPerPage) => {
            setCountPerPage(rowPerPage);
          }}
        />
      </div>
      <div className="projekte-datatable-tablet">
        <DataTable
          columns={columnsTablet}
          data={leadData}
          responsive
          noDataComponent={customNoDataComponent()}
          pagination
          paginationServer
          paginationTotalRows={count}
          paginationPerPage={countPerPage}
          paginationRowsPerPageOptions={[5, 10, 20, 25, 50]}
          paginationDefaultPage={page}
          progressPending={loading}
          progressComponent={
            <div className="LoadinComponent">
              <TailSpin color="#334D52" height={30} width={30} />
            </div>
          }
          onChangePage={(page) => {
            setPage(page);
          }}
          onChangeRowsPerPage={(rowPerPage) => {
            setCountPerPage(rowPerPage);
          }}
        />
      </div>
    </>
  );
};

export default Calendar;
