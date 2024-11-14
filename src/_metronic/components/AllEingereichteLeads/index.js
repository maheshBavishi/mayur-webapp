import React, { useEffect, useState } from "react";
import { ApiGet } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ReactApexCharts from "react-apexcharts";
import newimage from "../../../../src/assets/icon/icon.svg";
import icon from "../../../../src/assets/icon/Frame 3000.svg";
import "tippy.js/dist/tippy.css";
import "../EingereichteLeads/EingereichteLeads.scss";
import DatePicker from "react-datepicker";
Chart.register(ArcElement, Tooltip, Legend);

export default function AllEingereichteLeads() {
  const [leadData, setLeadData] = useState({});
  const [graphDatas, setGraphDatas] = useState([
    { month: 0, year: 0, count: 0 },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [statusDatas, setStatusDatas] = useState();
  const [newData, setNewData] = useState([]);
  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [firstDate, setFirstDate] = useState();
  const [endendDate, setEndEndDate] = useState(new Date());
  const [targetLead, setTargetLead] = useState(0);
  const [actualLead, setActualLead] = useState(0);



  useEffect(() => {
    let oneWeekAgo = new Date();
    let newoneWeekAgo = new Date();
    let thirdOneWeek = new Date();
    oneWeekAgo.setDate(endDate.getDate() - 7);
    setStartDate(oneWeekAgo);
    newoneWeekAgo.setDate(newEndDate.getDate() - 7);
    setNewStartDate(newoneWeekAgo);
    thirdOneWeek.setDate(endendDate.getDate() - 7);
    setFirstDate(thirdOneWeek);
  }, []);
 

  const getLeadData = async () => {
    try {
      let resp = await ApiGet(
        `straper/getAllUserPatners?startDate=${
          firstDate.toISOString().split("T")[0]
        }${`&endDate=${endendDate.toISOString().split("T")[0]}`}`
      );
      setLeadData(resp?.data?.payload);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };




  useEffect(() => {
    endendDate && firstDate && getLeadData();
  }, [firstDate, endendDate]);

  const ourdata = {
    labels: ["aktuell", "offen"],
    datasets: [
      {
        data:
          targetLead > actualLead
            ? [actualLead, targetLead - actualLead]
            : targetLead > 0 && actualLead > 0 && targetLead < actualLead
            ? [actualLead, 0]
            : [0, 100],
        backgroundColor: ["#2C4570", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const newStatusDats = {
    labels: ["aktuell", "offen", "data"],
    datasets: [
      {
        data: [newData?.Open, newData?.Confirmed, newData?.Rejected],
        backgroundColor: [
          newData?.Open ? "#E8A56A" : "#E0E0E0",
          "#7CC5AF",
          "#EA7575",
        ],
        borderWidth: 0,
      },
    ],
  };

  const nullData = {
    // labels: ["No data found"],
    datasets: [
      {
        backgroundColor: ["#E0E0E0"],
        borderWidth: 0,
        data: [100],
      },
    ],
  };

  const ouroptions = {
    cutout: "80%",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };
  const leads = [
    {
      name: "Leads",
      data: graphDatas
        ? [
            graphDatas?.[0]?.data || 0,
            graphDatas?.[1]?.data || 0,
            graphDatas?.[2]?.data || 0,
            graphDatas?.[3]?.data || 0,
            graphDatas?.[4]?.data || 0,
            graphDatas?.[5]?.data || 0,
            graphDatas?.[6]?.data || 0,
            graphDatas?.[7]?.data || 0,
            graphDatas?.[8]?.data || 0,
            graphDatas?.[9]?.data || 0,
            graphDatas?.[10]?.data || 0,
            graphDatas?.[11]?.data || 0,
          ]
        : Array(12).fill(0),
    },
  ];

  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
      foreColor: "#BABABA",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          fontSize: "11.4 px",
          fontWeight: 600,
          lineHeight: "13.79px",
          colors: "#BABABA",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5,
      labels: {
        style: {
          colors: ["#BABABA"],
        },
        formatter: function (val) {
          return val?.toFixed(0);
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50px",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#2C4570"],
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setOptions((prevOptions) => ({
          ...prevOptions,
          chart: {
            ...prevOptions.chart,
            width: "100%",
          },
          xaxis: {
            ...prevOptions.xaxis,
            labels: {
              ...prevOptions.xaxis.labels,
              style: {
                ...prevOptions.xaxis.labels.style,
                fontSize: "8px",
              },
            },
          },
          plotOptions: {
            ...prevOptions.plotOptions,
            bar: {
              columnWidth: "60%",
            },
          },
        }));
      } else if (window.innerWidth < 825) {
        setOptions((prevOptions) => ({
          ...prevOptions,
          chart: {
            ...prevOptions.chart,
            width: "100%",
          },
          xaxis: {
            ...prevOptions.xaxis,
            labels: {
              ...prevOptions.xaxis.labels,
              style: {
                ...prevOptions.xaxis.labels.style,
                fontSize: "8px",
              },
            },
          },
          plotOptions: {
            ...prevOptions.plotOptions,
            bar: {
              columnWidth: "18px",
            },
          },
        }));
      } else {
        // Default options for larger screens
        setOptions((prevOptions) => ({
          ...prevOptions,
          chart: {
            ...prevOptions.chart,
            width: "100%",
          },
          xaxis: {
            ...prevOptions.xaxis,
            labels: {
              ...prevOptions.xaxis.labels,
              style: {
                ...prevOptions.xaxis.labels.style,
                fontSize: "11.4px",
              },
            },
          },
          plotOptions: {
            ...prevOptions.plotOptions,
            bar: {
              columnWidth: "50px",
            },
          },
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const statusData = async () => {
    try {
      let resp = await ApiGet(
        `straper/getUserStatusCount?startDate=${
          startDate?.toISOString().split("T")[0]
        }${endDate ? `&endDate=${endDate?.toISOString().split("T")[0]}` : ""}`
      );
      let filterData = resp?.data?.payload?.map((item) => {
        return item?.counts;
      });

      let confirmStatusData = filterData?.map((item) => {
        return item?.[0];
      });
      let confirmStatusDatatotalCount = confirmStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );

      let rejectStatusData = filterData?.map((item) => {
        return item?.[1];
      });
      let rejectStatusDatatotalCount = rejectStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );

      let openStatusData = filterData?.map((item) => {
        return item?.[2];
      });
      let openStatusDatatotalCount = openStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );
      let monthfilterData = resp?.data?.payload?.map((item) => {
        return item?.month;
      });
    
      const combinedData = [
        { monthName: "Jan", data: 0 },
        { monthName: "Feb", data: 0 },
        { monthName: "Mar", data: 0 },
        { monthName: "Apr", data: 0 },
        { monthName: "May", data: 0 },
        { monthName: "Jun", data: 0 },
        { monthName: "Jul", data: 0 },
        { monthName: "Aug", data: 0 },
        { monthName: "Sep", data: 0 },
        { monthName: "Oct", data: 0 },
        { monthName: "Nov", data: 0 },
        { monthName: "Dec", data: 0 },
      ];
      let news = monthfilterData.forEach((user) => {
        let data = user?.forEach((monthData, index) => {
          combinedData[index].data += monthData.data;
        });
      });
      setGraphDatas(combinedData);
     
   
      setStatusDatas({
        ...statusDatas,
        Open: openStatusDatatotalCount,
        Rejected: rejectStatusDatatotalCount,
        Confirmed: confirmStatusDatatotalCount,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newStatusData = async () => {
    try {
      let resp = await ApiGet(
        `straper/getUserStatusCount?startDate=${
          newStartDate?.toISOString().split("T")[0]
        }${
          newEndDate
            ? `&endDate=${newEndDate?.toISOString().split("T")[0]}`
            : ""
        }`
      );

      let filterData = resp?.data?.payload?.map((item) => {
        return item?.counts;
      });

      let confirmStatusData = filterData?.map((item) => {
        return item?.[0];
      });
      let confirmStatusDatatotalCount = confirmStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );

      let rejectStatusData = filterData?.map((item) => {
        return item?.[1];
      });
      let rejectStatusDatatotalCount = rejectStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );

      let openStatusData = filterData?.map((item) => {
        return item?.[2];
      });
      let openStatusDatatotalCount = openStatusData.reduce(
        (acc, curr) => acc + (curr.count || 0),
        0
      );
      let monthfilterData = resp?.data?.payload?.map((item) => {
        return item?.month;
      });
      const currentMonthIndex = new Date().getMonth(); // Gets the current month (0-11)
      const currentMonthData = monthfilterData.map(
        (year) => year[currentMonthIndex]
      );
      const userLeadData = resp?.data?.payload?.map((item) => item?.userLead);

      const sumofuserLead = userLeadData?.reduce(
        (acc, value) => acc + (value === null ? 0 : value),
        0
      );
      const sumOfTotalLead = currentMonthData?.reduce(
        (sum, item) => sum + item.data,
        0
      );
      setTargetLead(sumofuserLead);
      setActualLead(sumOfTotalLead);
      setNewData({
        ...newData,
        Open: openStatusDatatotalCount,
        Rejected: rejectStatusDatatotalCount,
        Confirmed: confirmStatusDatatotalCount,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    startDate && endDate && statusData();
  }, [startDate,  endDate]);

  useEffect(() => {
    newStartDate && newEndDate && newStatusData();
  }, [newEndDate,  newStartDate]);

  const handleOnNewChange = (dates) => {
    const [start, end] = dates;
    setNewStartDate(start);
    setNewEndDate(end);
  };

  const newhandleOnNewChange = (dates) => {
    const [start, end] = dates;
    setFirstDate(start);
    setEndEndDate(end);
  };
  return (
    <>
      <div className="eingereichteLeads-page-all-content-alignment">
        <div className="page-header-alignment">
          <h2>Leads</h2>
        </div>
        <div className="first-grid">
          <div className="first-grid-items-pp">
            <div className="date-picker">
              <DatePicker
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                placeholderText="Date"
                onChange={handleOnChange}
                onKeyDown={(e) => e.preventDefault()}
                maxDate={new Date()}
                selectsRange
                dateFormat="dd/MM/yyyy"
                className="custom-date"
              />
              <div className="custom-date-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_4149_1535)">
                    <path
                      d="M4.66406 1.16797V3.5013M9.33073 1.16797V3.5013"
                      stroke="#2C4570"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.0833 2.33594H2.91667C2.27233 2.33594 1.75 2.85827 1.75 3.5026V11.6693C1.75 12.3136 2.27233 12.8359 2.91667 12.8359H11.0833C11.7277 12.8359 12.25 12.3136 12.25 11.6693V3.5026C12.25 2.85827 11.7277 2.33594 11.0833 2.33594Z"
                      stroke="#2C4570"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.75 5.83594H12.25"
                      stroke="#2C4570"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4149_1535">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="sub-box-pp">
              <div className="left-content-pp">
                <div className="icon-pp">
                  <svg
                    width="44"
                    height="45"
                    viewBox="0 0 44 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_4156_1529)">
                      <rect
                        y="0.5"
                        width="44"
                        height="44"
                        rx="22"
                        fill="white"
                      />
                      <g clip-path="url(#clip1_4156_1529)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21 13C19.6739 13 18.4021 13.5268 17.4645 14.4645C16.5268 15.4021 16 16.6739 16 18C16 19.3261 16.5268 20.5979 17.4645 21.5355C18.4021 22.4732 19.6739 23 21 23C22.3261 23 23.5979 22.4732 24.5355 21.5355C25.4732 20.5979 26 19.3261 26 18C26 16.6739 25.4732 15.4021 24.5355 14.4645C23.5979 13.5268 22.3261 13 21 13ZM21 24C18.605 24 16.425 24.694 14.822 25.672C14.022 26.16 13.338 26.736 12.844 27.362C12.358 27.976 12 28.713 12 29.5C12 30.345 12.411 31.011 13.003 31.486C13.563 31.936 14.302 32.234 15.087 32.442C16.665 32.859 18.771 33 21 33C21.2307 33 21.459 32.9983 21.685 32.995C21.8525 32.9927 22.0167 32.9484 22.1626 32.8661C22.3085 32.7838 22.4313 32.6662 22.5199 32.524C22.6085 32.3819 22.66 32.2198 22.6696 32.0525C22.6792 31.8853 22.6467 31.7184 22.575 31.567C22.1958 30.7644 21.9994 29.8877 22 29C22 27.748 22.383 26.588 23.037 25.627C23.1342 25.4842 23.1928 25.3186 23.207 25.1465C23.2212 24.9743 23.1905 24.8014 23.118 24.6446C23.0455 24.4878 22.9336 24.3524 22.7932 24.2517C22.6528 24.151 22.4888 24.0884 22.317 24.07C21.8863 24.0233 21.4473 24 21 24ZM28.864 24.997C28.776 24.8459 28.6499 24.7206 28.4983 24.6335C28.3466 24.5463 28.1749 24.5005 28 24.5005C27.8251 24.5005 27.6534 24.5463 27.5017 24.6335C27.3501 24.7206 27.224 24.8459 27.136 24.997L26.226 26.559L24.46 26.941C24.289 26.978 24.1307 27.0592 24.0009 27.1765C23.8711 27.2938 23.7744 27.4431 23.7203 27.6095C23.6663 27.7759 23.6568 27.9535 23.6929 28.1247C23.729 28.2959 23.8094 28.4546 23.926 28.585L25.13 29.933L24.948 31.731C24.9304 31.905 24.9587 32.0806 25.0301 32.2402C25.1015 32.3998 25.2135 32.538 25.355 32.6408C25.4965 32.7436 25.6624 32.8075 25.8363 32.8261C26.0102 32.8448 26.186 32.8175 26.346 32.747L28 32.017L29.654 32.747C29.814 32.8175 29.9898 32.8448 30.1637 32.8261C30.3376 32.8075 30.5035 32.7436 30.645 32.6408C30.7865 32.538 30.8985 32.3998 30.9699 32.2402C31.0413 32.0806 31.0696 31.905 31.052 31.731L30.87 29.932L32.074 28.585C32.1906 28.4546 32.271 28.2959 32.3071 28.1247C32.3432 27.9535 32.3337 27.7759 32.2797 27.6095C32.2256 27.4431 32.1289 27.2938 31.9991 27.1765C31.8693 27.0592 31.711 26.978 31.54 26.941L29.774 26.559L28.864 24.997Z"
                          fill="#E47916"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_4156_1529">
                        <rect
                          y="0.5"
                          width="44"
                          height="44"
                          rx="22"
                          fill="white"
                        />
                      </clipPath>
                      <clipPath id="clip1_4156_1529">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(10 11)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p>Offen</p>
              </div>
              <div className="right-content-pp">
                <h6>{statusDatas?.Open || 0}</h6>
              </div>
            </div>
            <div className="sub-box-pp sub-box-margin-pp">
              <div className="left-content-pp">
                <div className="icon-pp">
                  <svg
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="45" height="45" rx="22.5" fill="#2C4570" />
                    <path
                      d="M19.8845 22.498C22.7059 22.498 24.9926 20.1841 24.9926 17.3291C24.9926 14.4741 22.7059 12.1602 19.8845 12.1602C17.0631 12.1602 14.7764 14.4741 14.7764 17.3291C14.7764 20.1841 17.0631 22.498 19.8845 22.498ZM23.4602 23.7902H22.7937C21.9078 24.2021 20.9221 24.4363 19.8845 24.4363C18.8469 24.4363 17.8652 24.2021 16.9753 23.7902H16.3088C13.3477 23.7902 10.9453 26.2212 10.9453 29.2176V30.8975C10.9453 31.9676 11.8033 32.8358 12.8609 32.8358H26.9081C27.9657 32.8358 28.8237 31.9676 28.8237 30.8975V29.2176C28.8237 26.2212 26.4213 23.7902 23.4602 23.7902ZM36.3502 18.6052L35.2407 17.4704C35.0572 17.2806 34.7579 17.2806 34.5703 17.4664L30.388 21.6661L28.5723 19.8166C28.3887 19.6268 28.0894 19.6268 27.9018 19.8126L26.7804 20.9392C26.5929 21.125 26.5929 21.4279 26.7764 21.6177L30.0369 24.9411C30.2204 25.1309 30.5197 25.1309 30.7073 24.9452L36.3462 19.2836C36.5297 19.0938 36.5337 18.7909 36.3502 18.6052Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <p>Bestätigt</p>
              </div>
              <div className="right-content-pp">
                <h6>{statusDatas?.Confirmed || 0}</h6>
              </div>
            </div>
            <div className="sub-box-pp sub-box-color-pp">
              <div className="left-content-pp">
                <div className="icon-pp">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_4156_1558)">
                      <rect
                        y="0.5"
                        width="44"
                        height="44"
                        rx="22"
                        fill="white"
                      />
                      <g clip-path="url(#clip1_4156_1558)">
                        <path
                          d="M35.11 22.9062L36.82 21.2141C37.0563 20.9803 37.0563 20.6018 36.82 20.368L35.965 19.5219C35.7288 19.2881 35.3463 19.2881 35.11 19.5219L33.4 21.2141L31.69 19.5219C31.4538 19.2881 31.0713 19.2881 30.835 19.5219L29.98 20.368C29.7437 20.6018 29.7437 20.9803 29.98 21.2141L31.69 22.9062L29.98 24.5984C29.7437 24.8322 29.7437 25.2107 29.98 25.4445L30.835 26.2906C31.0713 26.5244 31.4538 26.5244 31.69 26.2906L33.4 24.5984L35.11 26.2906C35.3463 26.5244 35.7288 26.5244 35.965 26.2906L36.82 25.4445C37.0563 25.2107 37.0563 24.8322 36.82 24.5984L35.11 22.9062ZM21.4 23.5C24.0513 23.5 26.2 21.3736 26.2 18.75C26.2 16.1264 24.0513 14 21.4 14C18.7488 14 16.6 16.1264 16.6 18.75C16.6 21.3736 18.7488 23.5 21.4 23.5ZM24.76 24.6875H24.1337C23.3013 25.066 22.375 25.2812 21.4 25.2812C20.425 25.2812 19.5025 25.066 18.6663 24.6875H18.04C15.2575 24.6875 13 26.9215 13 29.675V31.2188C13 32.2021 13.8063 33 14.8 33H28C28.9938 33 29.8 32.2021 29.8 31.2188V29.675C29.8 26.9215 27.5425 24.6875 24.76 24.6875Z"
                          fill="#D12424"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_4156_1558">
                        <rect
                          y="0.5"
                          width="44"
                          height="44"
                          rx="22"
                          fill="white"
                        />
                      </clipPath>
                      <clipPath id="clip1_4156_1558">
                        <rect
                          width="24"
                          height="19"
                          fill="white"
                          transform="translate(13 14)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="sub-box-peragraph-pp">Abgelehnt</p>
              </div>
              <div className="right-content-pp">
                <h6>{statusDatas?.Rejected || 0}</h6>
              </div>
            </div>
          </div>

          <div className="first-grid-items">
            <div className="logo-designs-xx">
              <svg
                width="116"
                height="40"
                viewBox="0 0 66 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                <circle cx="3.56159" cy="4.99909" r="3.56159" fill="#2C4570" />
                <path
                  d="M12.2182 8V1.7834H13.3443V7.05598H16.0823V8H12.2182ZM19.0753 8.09106C18.6078 8.09106 18.2041 7.99393 17.8641 7.79966C17.5262 7.60337 17.2661 7.32613 17.084 6.96795C16.9019 6.60774 16.8108 6.18379 16.8108 5.69609C16.8108 5.21649 16.9019 4.79558 17.084 4.43335C17.2682 4.06909 17.5252 3.78578 17.855 3.58342C18.1849 3.37903 18.5724 3.27684 19.0176 3.27684C19.305 3.27684 19.5761 3.32338 19.8311 3.41647C20.0881 3.50753 20.3148 3.64919 20.511 3.84143C20.7094 4.03368 20.8652 4.27854 20.9785 4.57601C21.0918 4.87146 21.1485 5.22358 21.1485 5.63235V5.96928H17.3269V5.22863H20.0952C20.0932 5.01818 20.0476 4.83099 19.9586 4.66708C19.8696 4.50114 19.7451 4.37061 19.5852 4.2755C19.4274 4.18039 19.2432 4.13284 19.0328 4.13284C18.8082 4.13284 18.6109 4.18748 18.4409 4.29675C18.2709 4.404 18.1383 4.54566 18.0432 4.72171C17.9501 4.89575 17.9026 5.08698 17.9006 5.29541V5.94197C17.9006 6.21313 17.9501 6.44585 18.0493 6.64012C18.1485 6.83236 18.2871 6.98009 18.4652 7.08329C18.6432 7.18448 18.8517 7.23507 19.0905 7.23507C19.2503 7.23507 19.395 7.21281 19.5245 7.16829C19.654 7.12174 19.7663 7.05395 19.8615 6.96491C19.9566 6.87587 20.0284 6.76558 20.077 6.63405L21.103 6.74939C21.0382 7.02056 20.9148 7.25733 20.7326 7.45969C20.5525 7.66003 20.3218 7.81585 20.0405 7.92715C19.7593 8.03643 19.4375 8.09106 19.0753 8.09106ZM23.4198 8.0941C23.1243 8.0941 22.8582 8.04148 22.6214 7.93626C22.3867 7.829 22.2005 7.67116 22.0629 7.46273C21.9273 7.25429 21.8595 6.99729 21.8595 6.69172C21.8595 6.42865 21.9081 6.21111 22.0052 6.0391C22.1024 5.86709 22.2349 5.72948 22.4029 5.62628C22.5709 5.52307 22.7601 5.44516 22.9705 5.39255C23.183 5.33791 23.4026 5.29845 23.6292 5.27417C23.9024 5.24584 24.124 5.22054 24.294 5.19828C24.464 5.174 24.5874 5.13757 24.6643 5.089C24.7432 5.03841 24.7827 4.9605 24.7827 4.85527V4.83706C24.7827 4.60839 24.7149 4.43132 24.5793 4.30586C24.4437 4.18039 24.2484 4.11766 23.9935 4.11766C23.7243 4.11766 23.5108 4.17635 23.353 4.29372C23.1972 4.41109 23.0919 4.54971 23.0373 4.70957L22.0113 4.56387C22.0923 4.28056 22.2258 4.0438 22.412 3.85358C22.5982 3.66133 22.8258 3.51765 23.095 3.42254C23.3641 3.32541 23.6616 3.27684 23.9874 3.27684C24.212 3.27684 24.4356 3.30315 24.6582 3.35576C24.8808 3.40838 25.0842 3.49539 25.2684 3.61681C25.4525 3.73621 25.6002 3.89911 25.7115 4.10552C25.8249 4.31193 25.8815 4.56994 25.8815 4.87956V8H24.8252V7.35952H24.7888C24.722 7.48903 24.6279 7.61045 24.5065 7.72377C24.3871 7.83507 24.2363 7.92513 24.0542 7.99393C23.8741 8.06071 23.6626 8.0941 23.4198 8.0941ZM23.7051 7.28667C23.9257 7.28667 24.1169 7.24316 24.2788 7.15615C24.4407 7.06711 24.5651 6.94973 24.6522 6.80403C24.7412 6.65833 24.7857 6.49948 24.7857 6.32747V5.77805C24.7513 5.80638 24.6926 5.83269 24.6097 5.85697C24.5287 5.88126 24.4377 5.9025 24.3365 5.92072C24.2353 5.93893 24.1351 5.95512 24.036 5.96928C23.9368 5.98345 23.8508 5.99559 23.7779 6.00571C23.614 6.02797 23.4673 6.06439 23.3378 6.11499C23.2083 6.16558 23.1061 6.2364 23.0312 6.32747C22.9564 6.41651 22.9189 6.53185 22.9189 6.67351C22.9189 6.87587 22.9928 7.02866 23.1405 7.13186C23.2882 7.23507 23.4764 7.28667 23.7051 7.28667ZM28.7166 8.08196C28.3503 8.08196 28.0225 7.98786 27.7331 7.79966C27.4438 7.61146 27.2151 7.33827 27.0471 6.98009C26.8792 6.62191 26.7952 6.18682 26.7952 5.67485C26.7952 5.1568 26.8802 4.71969 27.0502 4.36353C27.2222 4.00535 27.4539 3.73519 27.7453 3.55307C28.0367 3.36892 28.3615 3.27684 28.7197 3.27684C28.9928 3.27684 29.2175 3.32338 29.3935 3.41647C29.5696 3.50753 29.7092 3.61782 29.8124 3.74734C29.9156 3.87482 29.9956 3.99523 30.0522 4.10855H30.0978V1.7834H31.1996V8H30.119V7.26542H30.0522C29.9956 7.37874 29.9136 7.49915 29.8063 7.62664C29.6991 7.7521 29.5574 7.85936 29.3814 7.9484C29.2053 8.03744 28.9837 8.08196 28.7166 8.08196ZM29.0232 7.18043C29.2559 7.18043 29.4542 7.1177 29.6182 6.99223C29.7821 6.86474 29.9065 6.68767 29.9915 6.46103C30.0765 6.23438 30.119 5.9703 30.119 5.66877C30.119 5.36725 30.0765 5.10519 29.9915 4.88259C29.9085 4.65999 29.7851 4.48697 29.6212 4.36353C29.4593 4.24009 29.26 4.17837 29.0232 4.17837C28.7783 4.17837 28.574 4.24211 28.41 4.3696C28.2461 4.49709 28.1227 4.67315 28.0397 4.89777C27.9567 5.12239 27.9153 5.3794 27.9153 5.66877C27.9153 5.96018 27.9567 6.22021 28.0397 6.44889C28.1247 6.67553 28.2492 6.85462 28.4131 6.98616C28.579 7.11567 28.7824 7.18043 29.0232 7.18043ZM36.0556 4.56994L35.0539 4.67922C35.0256 4.57804 34.976 4.48293 34.9051 4.39389C34.8363 4.30485 34.7433 4.23301 34.6259 4.17837C34.5085 4.12373 34.3648 4.09641 34.1949 4.09641C33.9662 4.09641 33.7739 4.14599 33.6181 4.24515C33.4643 4.34431 33.3884 4.47281 33.3905 4.63065C33.3884 4.76623 33.438 4.87652 33.5392 4.96152C33.6424 5.04651 33.8124 5.11632 34.0491 5.17096L34.8444 5.34095C35.2856 5.43606 35.6134 5.58682 35.8279 5.79323C36.0445 5.99964 36.1537 6.26979 36.1558 6.60369C36.1537 6.89712 36.0677 7.15615 35.8977 7.38077C35.7298 7.60337 35.496 7.7774 35.1965 7.90287C34.8971 8.02833 34.553 8.09106 34.1645 8.09106C33.5938 8.09106 33.1345 7.97167 32.7864 7.73288C32.4383 7.49207 32.2309 7.15716 32.1641 6.72815L33.2356 6.62494C33.2842 6.8354 33.3874 6.99425 33.5453 7.10151C33.7031 7.20876 33.9085 7.26239 34.1615 7.26239C34.4225 7.26239 34.632 7.20876 34.7898 7.10151C34.9497 6.99425 35.0296 6.86171 35.0296 6.70386C35.0296 6.5703 34.978 6.46002 34.8748 6.373C34.7736 6.28598 34.6158 6.2192 34.4013 6.17266L33.606 6.00571C33.1588 5.91262 32.8279 5.75579 32.6134 5.53521C32.3989 5.31262 32.2926 5.03133 32.2947 4.69136C32.2926 4.404 32.3705 4.1551 32.5284 3.94464C32.6883 3.73216 32.9098 3.56824 33.1932 3.4529C33.4785 3.33553 33.8073 3.27684 34.1797 3.27684C34.7261 3.27684 35.1561 3.3932 35.4697 3.62592C35.7854 3.85864 35.9807 4.17331 36.0556 4.56994ZM41.2462 8.09106C40.7787 8.09106 40.375 7.99393 40.0351 7.79966C39.6971 7.60337 39.4371 7.32613 39.2549 6.96795C39.0728 6.60774 38.9818 6.18379 38.9818 5.69609C38.9818 5.21649 39.0728 4.79558 39.2549 4.43335C39.4391 4.06909 39.6961 3.78578 40.0259 3.58342C40.3558 3.37903 40.7433 3.27684 41.1885 3.27684C41.4759 3.27684 41.747 3.32338 42.002 3.41647C42.259 3.50753 42.4857 3.64919 42.682 3.84143C42.8803 4.03368 43.0361 4.27854 43.1494 4.57601C43.2628 4.87146 43.3194 5.22358 43.3194 5.63235V5.96928H39.4978V5.22863H42.2661C42.2641 5.01818 42.2186 4.83099 42.1295 4.66708C42.0405 4.50114 41.916 4.37061 41.7562 4.2755C41.5983 4.18039 41.4142 4.13284 41.2037 4.13284C40.9791 4.13284 40.7818 4.18748 40.6118 4.29675C40.4418 4.404 40.3093 4.54566 40.2141 4.72171C40.1211 4.89575 40.0735 5.08698 40.0715 5.29541V5.94197C40.0715 6.21313 40.1211 6.44585 40.2202 6.64012C40.3194 6.83236 40.458 6.98009 40.6361 7.08329C40.8142 7.18448 41.0226 7.23507 41.2614 7.23507C41.4212 7.23507 41.5659 7.21281 41.6954 7.16829C41.825 7.12174 41.9373 7.05395 42.0324 6.96491C42.1275 6.87587 42.1993 6.76558 42.2479 6.63405L43.2739 6.74939C43.2091 7.02056 43.0857 7.25733 42.9036 7.45969C42.7235 7.66003 42.4928 7.81585 42.2115 7.92715C41.9302 8.03643 41.6084 8.09106 41.2462 8.09106ZM44.249 8V3.33755H45.3145V4.11462H45.363C45.448 3.84548 45.5937 3.63806 45.8001 3.49236C46.0086 3.34463 46.2463 3.27077 46.5135 3.27077C46.5742 3.27077 46.642 3.2738 46.7168 3.27988C46.7937 3.28392 46.8575 3.29101 46.9081 3.30112V4.31193C46.8615 4.29574 46.7877 4.28157 46.6865 4.26943C46.5873 4.25527 46.4912 4.24818 46.3981 4.24818C46.1978 4.24818 46.0177 4.29169 45.8578 4.37871C45.7 4.4637 45.5755 4.58208 45.4844 4.73386C45.3934 4.88563 45.3479 5.06067 45.3479 5.25899V8H44.249ZM47.5774 8V7.30185L49.9815 4.28765V4.24818H47.6563V3.33755H51.3262V4.08731L49.0374 7.0499V7.08937H51.4051V8H47.5774ZM52.4379 8V3.33755H53.5367V8H52.4379ZM52.9904 2.67582C52.8163 2.67582 52.6666 2.61815 52.5411 2.5028C52.4156 2.38543 52.3529 2.24479 52.3529 2.08087C52.3529 1.91494 52.4156 1.77429 52.5411 1.65895C52.6666 1.54158 52.8163 1.48289 52.9904 1.48289C53.1664 1.48289 53.3162 1.54158 53.4396 1.65895C53.5651 1.77429 53.6278 1.91494 53.6278 2.08087C53.6278 2.24479 53.5651 2.38543 53.4396 2.5028C53.3162 2.61815 53.1664 2.67582 52.9904 2.67582ZM56.7308 8.09106C56.2633 8.09106 55.8596 7.99393 55.5196 7.79966C55.1817 7.60337 54.9217 7.32613 54.7395 6.96795C54.5574 6.60774 54.4663 6.18379 54.4663 5.69609C54.4663 5.21649 54.5574 4.79558 54.7395 4.43335C54.9237 4.06909 55.1807 3.78578 55.5105 3.58342C55.8404 3.37903 56.2279 3.27684 56.6731 3.27684C56.9605 3.27684 57.2316 3.32338 57.4866 3.41647C57.7436 3.50753 57.9703 3.64919 58.1666 3.84143C58.3649 4.03368 58.5207 4.27854 58.634 4.57601C58.7473 4.87146 58.804 5.22358 58.804 5.63235V5.96928H54.9824V5.22863H57.7507C57.7487 5.01818 57.7031 4.83099 57.6141 4.66708C57.5251 4.50114 57.4006 4.37061 57.2407 4.2755C57.0829 4.18039 56.8987 4.13284 56.6883 4.13284C56.4637 4.13284 56.2664 4.18748 56.0964 4.29675C55.9264 4.404 55.7938 4.54566 55.6987 4.72171C55.6056 4.89575 55.5581 5.08698 55.5561 5.29541V5.94197C55.5561 6.21313 55.6056 6.44585 55.7048 6.64012C55.804 6.83236 55.9426 6.98009 56.1207 7.08329C56.2987 7.18448 56.5072 7.23507 56.746 7.23507C56.9058 7.23507 57.0505 7.21281 57.18 7.16829C57.3095 7.12174 57.4219 7.05395 57.517 6.96491C57.6121 6.87587 57.6839 6.76558 57.7325 6.63405L58.7585 6.74939C58.6937 7.02056 58.5703 7.25733 58.3881 7.45969C58.208 7.66003 57.9773 7.81585 57.6961 7.92715C57.4148 8.03643 57.093 8.09106 56.7308 8.09106ZM60.8324 1.7834V8H59.7336V1.7834H60.8324ZM64.2906 3.33755V4.18748H61.6103V3.33755H64.2906ZM62.272 2.2205H63.3708V6.59762C63.3708 6.74535 63.3931 6.85867 63.4376 6.93759C63.4842 7.01449 63.5449 7.06711 63.6197 7.09544C63.6946 7.12377 63.7776 7.13793 63.8686 7.13793C63.9374 7.13793 64.0002 7.13287 64.0568 7.12276C64.1155 7.11264 64.16 7.10353 64.1904 7.09544L64.3756 7.95447C64.3169 7.9747 64.2329 7.99696 64.1236 8.02125C64.0164 8.04553 63.8848 8.0597 63.729 8.06374C63.4538 8.07184 63.2059 8.03035 62.9853 7.93929C62.7648 7.8462 62.5897 7.70253 62.4602 7.50826C62.3327 7.31399 62.27 7.07115 62.272 6.77975V2.2205Z"
                  fill="#A4ABBF"
                />
              </svg>
            </div>
            {graphDatas && (
              <ReactApexCharts
                options={options}
                series={leads}
                type="bar"
                height={350}
              />
            )}
          </div>
        </div>
        <div className="sec-grid">
          <div className="sec-grid-items">
            <div className="alignment">
              <h2>{`Monatsziel -> ${targetLead ? targetLead : 0}`}</h2>
            </div>
            <div className="white-box-chart">
              <div className="White-chart-circle-main">
                <div className="white-chart-circle">
                  <Doughnut data={ourdata} options={ouroptions} />
                  <div className="cicrle-inner-text-main">
                    {targetLead && targetLead > actualLead
                      ? ((actualLead / targetLead) * 100).toFixed(0) + " %"
                      : targetLead > 0 && targetLead < actualLead
                      ? "100 %"
                      : "0 %"}
                    <div className="circle-div-last-text"></div>
                  </div>
                </div>
              </div>
              <div className="new-chart-image">
                <img src={icon} />
              </div>
            </div>
          </div>
          <div className="sec-grid-items-main">
            <div className="sec-grid-items">
              <div className="alignment">
                <div className="date-picker-new">
                  <DatePicker
                    selected={newStartDate}
                    startDate={newStartDate}
                    endDate={newEndDate}
                    placeholderText="Date"
                    onChange={handleOnNewChange}
                    onKeyDown={(e) => e.preventDefault()}
                    maxDate={new Date()}
                    selectsRange
                    dateFormat="dd/MM/yyyy"
                    className="custom-date"
                  />
                  <div className="custom-date-icon custom-date-icon-mobile">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_4149_1535)">
                        <path
                          d="M4.66406 1.16797V3.5013M9.33073 1.16797V3.5013"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.0833 2.33594H2.91667C2.27233 2.33594 1.75 2.85827 1.75 3.5026V11.6693C1.75 12.3136 2.27233 12.8359 2.91667 12.8359H11.0833C11.7277 12.8359 12.25 12.3136 12.25 11.6693V3.5026C12.25 2.85827 11.7277 2.33594 11.0833 2.33594Z"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1.75 5.83594H12.25"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4149_1535">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="white-box-chart">
                <div className="white-chart-circle">
                  {newData != {} ||
                  newData != [] ||
                  newData?.Open > 0 ||
                  newData?.Confirmed > 0 ||
                  newData?.Rejected > 0 ? (
                    <Doughnut data={newStatusDats} options={ouroptions} />
                  ) : (
                    <Doughnut data={nullData} options={ouroptions} />
                  )}
                  <div className="cicrle-inner-text-main">
                    <div className="circle-div-last-text"></div>
                  </div>
                </div>
                <div className="new-chart-image imag-alig">
                  <div className="data">
                    <span></span>{" "}
                    <p>
                      {" "}
                      Offen - {newData?.Open || 0} (
                      {newData?.Open > 0
                        ? (
                            (Number(newData?.Open || 0) /
                              (Number(newData?.Open || 0) +
                                Number(newData?.Confirmed || 0) +
                                Number(newData?.Rejected || 0))) *
                            100
                          ).toFixed(0) + "%"
                        : 0 + "%"}
                      )
                    </p>
                  </div>
                  <div className="data2">
                    <span></span>{" "}
                    <p>
                      {" "}
                      Bestätigt - {newData?.Confirmed || 0} (
                      {newData?.Confirmed > 0
                        ? (
                            (Number(newData?.Confirmed) /
                              (Number(newData?.Open || 0) +
                                Number(newData?.Confirmed || 0) +
                                Number(newData?.Rejected || 0))) *
                            100
                          ).toFixed(0) + "%"
                        : 0 + "%"}
                      )
                    </p>
                  </div>
                  <div className="data3">
                    <span></span>{" "}
                    <p>
                      {" "}
                      Abgelehnt - {newData?.Rejected || 0} (
                      {newData?.Rejected > 0
                        ? (
                            (Number(newData?.Rejected) /
                              (Number(newData?.Open || 0) +
                                Number(newData?.Confirmed || 0) +
                                Number(newData?.Rejected || 0))) *
                            100
                          ).toFixed(0) + "%"
                        : 0 + "%"}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="alignment alignment-mobile">
                <div className="mobile-view-cards-top-berater">
                  <h2>Top Berater</h2>
                  <h3>Leads</h3>
                </div>
                <h2>Top Berater</h2>
                <div className="date-picker-new">
                  <DatePicker
                    selected={firstDate}
                    startDate={firstDate}
                    endDate={endendDate}
                    placeholderText="Date"
                    onChange={newhandleOnNewChange}
                    onKeyDown={(e) => e.preventDefault()}
                    maxDate={new Date()}
                    selectsRange
                    dateFormat="dd/MM/yyyy"
                    className="custom-date"
                  />
                  <div className="custom-date-icon">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_4149_1535)">
                        <path
                          d="M4.66406 1.16797V3.5013M9.33073 1.16797V3.5013"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.0833 2.33594H2.91667C2.27233 2.33594 1.75 2.85827 1.75 3.5026V11.6693C1.75 12.3136 2.27233 12.8359 2.91667 12.8359H11.0833C11.7277 12.8359 12.25 12.3136 12.25 11.6693V3.5026C12.25 2.85827 11.7277 2.33594 11.0833 2.33594Z"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1.75 5.83594H12.25"
                          stroke="#2C4570"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4149_1535">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>

                <h3>Leads</h3>
              </div>
              <div className="new-white-box">
                 { leadData && Array.isArray(leadData) &&leadData?.map((item) => {
                  return (
                    <div className="all-content-alignment">
                      <div
                        className={
                          item?.benutzername?.profileImage &&
                          item?.benutzername?.profileImage !== "null"
                            ? `new-class`
                            : `prifile-name`
                        }
                      >
                        <img
                          src={
                            item?.benutzername?.profileImage &&
                            item?.benutzername?.profileImage !== "null"
                              ? item?.benutzername?.profileImage
                              : newimage
                          }
                        />
                        <span>
                          {item?.benutzername?.vorname
                            ? item?.benutzername?.vorname
                            : item?.benutzername?.name}
                        </span>
                      </div>
                      <h4>{item?.count}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
