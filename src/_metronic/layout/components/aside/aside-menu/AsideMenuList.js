/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import { getUserInfo } from "../../../../../utils/user.util";
import "./sideMenu.scss";
import Auth from "../../../../../helpers/Auth";
import { getSocket } from "../../../../../socket";
import { NotificatioContext } from "../../../../../context/notificationContext";
import { ApiGet } from "../../../../../helpers/API/ApiData";

export function AsideMenuList({ layoutProps }) {
  const {
    notificationNumber,
    setNotificationNumber,
    newLeadNumber,
    setNewLeadNumber,
  } = useContext(NotificatioContext);
  const [isOpenKitsList, setIsOpenKitsList] = useState(false);
  const [newisOpenKitsList, setnewIsOpenKitsList] = useState(false);
  const [id, setId] = useState("");
  const [partnersData, setPartnersData] = useState([]);
  const [vattenfallpartnersData, setvattenfallPartnersData] = useState([]);

  console.log("partnersDataaaaaaaaaaaaa", partnersData)

  const [newId, setNewID] = useState();
  const [userData, setUserData] = useState(false);

  const location = useLocation();
  let userInfo = getUserInfo();

  const ref = useRef();
  const Logout = async () => {
    await Auth.deauthenticateLocalUser();
    window.location.reload();
  };
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${
          !hasSubmenu && "menu-item-active"
        } menu-item-open menu-item-not-hightlighted`
      : "";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");
    setId(idFromUrl);
  }, [window.location.search, id]);

  const socket = getSocket();
  const handleCheckNotification = (data) => {
    setNotificationNumber(data?.data ? data?.data : data?.unreadNotification);
  };
  const updateNotificationNumber = () => {
    socket.emit("update-notification", {});
    socket.on("update-notification", (response) => {
      setNotificationNumber(response?.data);
    });
  };
  const handleNewleadNotification = () => {
    socket.on("check-new-lead", (response) => {
      setNewLeadNumber(response?.data);
    });
  };

  const partnerData = async () => {
    try {
      let headers = {
        Authorization: `Bearer ${userInfo?.token}`,
      };
      let response = await ApiGet(`user/getUserPatners`, { headers: headers });
      setPartnersData(response?.data?.payload);
    } catch (error) {}
  };
  useEffect(() => {
    partnerData();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
        socket.emit("check-new-lead", {});
        socket.emit("check-new-lead", {});
      };

      socket.on("connect", handleConnect);
      socket.on("check-notification", handleCheckNotification);
      socket.on("check-new-lead", handleNewleadNotification);

      if (socket.connected) {
        handleConnect();
      }
      return () => {
        socket.off("connect", handleConnect);
        socket.off("check-notification", handleCheckNotification);
        socket.off("check-new-lead", handleNewleadNotification);
      };
    } else {
      console.error("Socket not available");
    }
  }, [socket?.id]);
  const localData = JSON.parse(localStorage.getItem("userinfo"));
  const getData = async () => {
    try {
      let resp = await ApiGet(`user/get?userId=${localData?.userId}`);
      setUserData(resp?.data?.payload?.data?.[0]?.PVVertrieb);
    } catch (error) {
      console.error(error);
    }
  };

  const getVattenData = async () => {
    try {
      let resp = await ApiGet(`user/getVattUserPatners?userId=${localData?.userId}`);
      setvattenfallPartnersData(resp?.data?.payload);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
    getVattenData()
  }, []);


  return (
    <>
      {userInfo?.role == "user" && (
        <ul className={`menu-nav ${layoutProps.ulClasses}`} ref={ref}>
          <li
            className={`menu-item  ${
              !id && getMenuItemActive("/eingereichteLeads", false)
            }`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link " to="/eingereichteLeads">
              <span className="svg-icon menu-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0052 8.33463C11.8462 8.33463 13.3385 6.84225 13.3385 5.0013C13.3385 3.16035 11.8462 1.66797 10.0052 1.66797C8.16426 1.66797 6.67188 3.16035 6.67188 5.0013C6.67188 6.84225 8.16426 8.33463 10.0052 8.33463Z"
                    fill="#9f9f9f"
                  />
                  <path
                    d="M16.6693 14.5859C16.6693 16.6568 16.6693 18.3359 10.0026 18.3359C3.33594 18.3359 3.33594 16.6568 3.33594 14.5859C3.33594 12.5151 6.32094 10.8359 10.0026 10.8359C13.6843 10.8359 16.6693 12.5151 16.6693 14.5859Z"
                    fill="#9f9f9f"
                  />
                </svg>
              </span>
              <span className="menu-text">Eingereichte Leads</span>
            </NavLink>
          </li>
          <li
            className={`menu-item  ${getMenuItemActive(
              "/persönlicheDaten",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link " to="/persönlicheDaten">
              <span className="svg-icon menu-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 3.75V16.244"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M17.5 7.5V16.25"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 1.25H11.25"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 18.75H15"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M17.5 16.25C17.5068 17.4986 16.25 18.75 15 18.75"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.5 16.25C2.5 17.5 3.75 18.75 5 18.75"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.5 3.75C2.5 2.50181 3.75 1.27965 5 1.25181"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.4932 7.50561L11.25 1.25"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.25 5C11.2538 6.2432 12.505 7.5 13.75 7.5"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.25 5V1.25"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.75 7.5H17.5"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 16.25H8.75"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 13.75H11.25"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 11.25H8.75"
                    stroke="#9f9f9f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span className="menu-text">Persönliche Daten</span>
            </NavLink>
          </li>

          {/* <li
            className={`menu-item ${getMenuItemActive(
              "/verfügbarkeit",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/verfügbarkeit">
              <span className="svg-icon menu-icon">
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.80781 5.69219C4.69054 5.57491 4.62465 5.41585 4.62465 5.25C4.62465 5.08415 4.69054 4.92509 4.80781 4.80781C4.92509 4.69054 5.08415 4.62465 5.25 4.62465C5.41585 4.62465 5.57491 4.69054 5.69219 4.80781L8.375 7.49141V0.875C8.375 0.70924 8.44085 0.550268 8.55806 0.433058C8.67527 0.315848 8.83424 0.25 9 0.25C9.16576 0.25 9.32473 0.315848 9.44194 0.433058C9.55915 0.550268 9.625 0.70924 9.625 0.875V7.49141L12.3078 4.80781C12.4251 4.69054 12.5841 4.62465 12.75 4.62465C12.9159 4.62465 13.0749 4.69054 13.1922 4.80781C13.3095 4.92509 13.3753 5.08415 13.3753 5.25C13.3753 5.41585 13.3095 5.57491 13.1922 5.69219L9.44219 9.44219C9.38414 9.5003 9.31521 9.5464 9.23934 9.57785C9.16346 9.6093 9.08213 9.62549 9 9.62549C8.91787 9.62549 8.83654 9.6093 8.76066 9.57785C8.68479 9.5464 8.61586 9.5003 8.55781 9.44219L4.80781 5.69219ZM17.75 9.625V14.625C17.75 14.9565 17.6183 15.2745 17.3839 15.5089C17.1495 15.7433 16.8315 15.875 16.5 15.875H1.5C1.16848 15.875 0.850537 15.7433 0.616116 15.5089C0.381696 15.2745 0.25 14.9565 0.25 14.625V9.625C0.25 9.29348 0.381696 8.97554 0.616116 8.74112C0.850537 8.5067 1.16848 8.375 1.5 8.375H5.59375C5.6348 8.37497 5.67545 8.38302 5.71339 8.39871C5.75133 8.41439 5.7858 8.4374 5.81484 8.46641L7.67188 10.3281C7.84607 10.5029 8.05306 10.6416 8.28097 10.7363C8.50887 10.8309 8.75322 10.8796 9 10.8796C9.24678 10.8796 9.49113 10.8309 9.71903 10.7363C9.94694 10.6416 10.1539 10.5029 10.3281 10.3281L12.1875 8.46875C12.2452 8.40987 12.3238 8.37617 12.4062 8.375H16.5C16.8315 8.375 17.1495 8.5067 17.3839 8.74112C17.6183 8.97554 17.75 9.29348 17.75 9.625ZM14.625 12.125C14.625 11.9396 14.57 11.7583 14.467 11.6042C14.364 11.45 14.2176 11.3298 14.0463 11.2589C13.875 11.1879 13.6865 11.1693 13.5046 11.2055C13.3227 11.2417 13.1557 11.331 13.0246 11.4621C12.8935 11.5932 12.8042 11.7602 12.768 11.9421C12.7318 12.124 12.7504 12.3125 12.8214 12.4838C12.8923 12.6551 13.0125 12.8015 13.1667 12.9045C13.3208 13.0075 13.5021 13.0625 13.6875 13.0625C13.9361 13.0625 14.1746 12.9637 14.3504 12.7879C14.5262 12.6121 14.625 12.3736 14.625 12.125Z"
                    fill="#9f9f9f"
                  />
                </svg>
              </span>
              <span className="menu-text">Verfügbarkeit</span>
            </NavLink>
          </li> */}

          {/* <li
            className={`menu-item  ${getMenuItemActive(
              "/mitteilungen",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink
              className="menu-link "
              to="/mitteilungen"
              onClick={() => updateNotificationNumber()}
            >
              <span className="svg-icon menu-icon">
                <div className="notification-icon-akignment">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5179 23H15.482M18.9641 8.53333C18.9641 6.80059 18.2304 5.13881 16.9243 3.91357C15.6183 2.68833 13.847 2 12 2C10.153 2 8.38161 2.68833 7.07558 3.91357C5.76956 5.13881 5.03583 6.80059 5.03583 8.53333C5.03583 11.6672 4.25098 13.8807 3.32666 15.401C2.43142 16.8734 1.98381 17.6096 2.00045 17.8009C2.01915 18.0156 2.06133 18.0912 2.23395 18.2193C2.38762 18.3333 3.11794 18.3333 4.57858 18.3333H19.4214C20.882 18.3333 21.6124 18.3333 21.766 18.2193C21.9386 18.0912 21.9809 18.0156 21.9996 17.8009C22.0162 17.6096 21.5685 16.8734 20.6733 15.401C19.749 13.8807 18.9641 11.6672 18.9641 8.53333Z"
                      stroke="#9f9f9f"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {notificationNumber > 0 && (
                    <div className="notification-number">
                      <div> {notificationNumber}</div>
                    </div>
                  )}
                </div>
              </span>
              <span className="menu-text">Mitteilungen</span>
            </NavLink>
          </li> */}

          {/* <li
            className={`menu-item  ${getMenuItemActive(
              `alleingereichteLeads`,
              false
            )}`}
            aria-haspopup="true"
            // onClick={}
          >
            <NavLink className="menu-link " to={`/alleingereichteLeads`}>
              <span className="svg-icon menu-icon">
                <i class="fas fa-user-check"></i>
              </span>
              <span className="menu-text">Team Performance</span>
            </NavLink>
          </li> */}
          {partnersData?.length > 0 && (
            <>
              <li
                className={`menu-item`}
                aria-haspopup="true"
                onClick={() => setIsOpenKitsList(!isOpenKitsList)}
              >
                <div className="menu-link">
                  <span className="svg-icon menu-icon">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
                  <span className="menu-text">Vertriebspartner</span>
                  <span className="svg-icon menu-icon">
                    {!isOpenKitsList ? (
                      <>
                        <svg
                          fill="#000000"
                          width="22px"
                          height="22px"
                          viewBox="-8.5 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>angle-down</title>
                          <path fill="#B5B5C3" d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>
                        </svg>
                      </>
                    ) : (
                      <svg
                        width="22px"
                        height="22px"
                        viewBox="0 0 32 32"
                        version="1.1"
                      >
                        <g id="icomoon-ignore"></g>
                        <path
                          d="M16.767 12.809l-0.754-0.754-6.035 6.035 0.754 0.754 5.281-5.281 5.256 5.256 0.754-0.754-3.013-3.013z"
                          fill="#B5B5C3"
                        ></path>
                      </svg>
                    )}
                  </span>
                </div>
              </li>

              {isOpenKitsList && (
                <>
                  {partnersData
                    ?.sort((a, b) => a?.name.localeCompare(b?.name))
                    .map((item, index) => {
                      return (
                        <li
                          key={index}
                          className={`menu-item  ${getMenuItemActive(
                            `/eingereichteLeads?id=${item?._id}`,
                            false
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link "
                            to={`/eingereichteLeads?id=${item?._id}`}
                            style={{ paddingLeft: "40px" }}
                          >
                            <span className="svg-icon menu-icon">
                              <i className="fas fa-user-check"></i>
                            </span>
                            <span className="menu-text">{item?.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                </>
              )}
            </>
          )}

{vattenfallpartnersData?.length > 0 && (
            <>
              <li
                className={`menu-item`}
                aria-haspopup="true"
                onClick={() => setnewIsOpenKitsList(!newisOpenKitsList)}
              >
                <div className="menu-link">
                  <span className="svg-icon menu-icon">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
                  <span className="menu-text">Vattenfall Vertriebspartner</span>
                  <span className="svg-icon menu-icon">
                    {!newisOpenKitsList ? (
                      <>
                        <svg
                          fill="#000000"
                          width="22px"
                          height="22px"
                          viewBox="-8.5 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>angle-down</title>
                          <path fill="#B5B5C3" d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>
                        </svg>
                      </>
                    ) : (
                      <svg
                        width="22px"
                        height="22px"
                        viewBox="0 0 32 32"
                        version="1.1"
                      >
                        <g id="icomoon-ignore"></g>
                        <path
                          d="M16.767 12.809l-0.754-0.754-6.035 6.035 0.754 0.754 5.281-5.281 5.256 5.256 0.754-0.754-3.013-3.013z"
                          fill="#B5B5C3"
                        ></path>
                      </svg>
                    )}
                  </span>
                </div>
              </li>

              {newisOpenKitsList && (
                <>
                  {vattenfallpartnersData
                    ?.sort((a, b) => a?.name.localeCompare(b?.name))
                    .map((item, index) => {
                      return (
                        <li
                          key={index}
                          className={`menu-item  ${getMenuItemActive(
                            `/projekte?id=${item?._id}`,
                            false
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link "
                            to={`/projekte?id=${item?._id}`}
                            style={{ paddingLeft: "40px" }}
                          >
                            <span className="svg-icon menu-icon">
                              <i className="fas fa-user-check"></i>
                            </span>
                            <span className="menu-text">{item?.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                </>
              )}
            </>
          )}

          
          {/* {
            <li
              className={`menu-item  ${
                !id && getMenuItemActive("/wattfoxteam", false)
              }`}
              aria-haspopup="true"
              onMouseEnter={() => setNewID(1)}
              onMouseLeave={() => setNewID("")}
            >
              <NavLink className="menu-link " to="/wattfoxteam">
                <span className="svg-icon menu-icon">
                  {getMenuItemActive("/wattfoxteam") || newId == "1" ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 270 228"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M52.7207 227.986C51.2107 226.076 48.7207 226.156 46.7207 225.136C40.431 221.967 35.5933 216.51 33.2007 209.886C31.8364 206.193 31.1586 202.282 31.2007 198.346C31.2407 174.106 31.2407 149.859 31.2007 125.606C31.3613 124.424 31.2096 123.221 30.7607 122.116H20.5507C16.8907 122.116 13.2207 122.116 9.5507 122.056C4.6907 121.986 0.640703 117.786 0.100703 112.986C-0.459297 107.986 1.3107 104.486 5.5507 101.696C8.8807 99.5158 11.6907 96.5658 14.7807 94.0058C23.694 86.6591 32.6174 79.3191 41.5507 71.9858C41.9107 71.6858 42.2907 71.3958 42.7207 71.0558C43.086 71.2218 43.4022 71.4794 43.6387 71.8035C43.8752 72.1276 44.024 72.5073 44.0707 72.9058C44.3107 77.4358 45.8007 81.7258 46.3707 86.2058C46.8607 90.0458 48.1107 93.7858 48.9607 97.5858C49.3807 99.4958 49.6907 101.446 49.9607 103.356C51.1207 110.356 52.9607 117.216 54.3807 124.146C55.5607 129.776 56.8207 135.416 58.3807 140.956C59.9407 146.496 61.4607 152.186 62.9507 157.806C64.3807 163.206 65.8107 168.626 67.4307 173.956C69.5107 180.796 71.3107 187.746 73.9907 194.416C75.0407 197.036 75.6607 199.826 76.5607 202.796H97.8907C111.001 169.616 124.001 136.346 134.781 102.086C145.521 136.206 158.511 169.456 171.701 202.866H192.761C207.851 159.776 217.571 115.516 226.151 70.4258L243.771 84.9858C251.001 90.9858 258.151 97.0658 265.511 102.886C266.766 103.888 267.806 105.133 268.568 106.548C269.329 107.962 269.796 109.516 269.941 111.116C269.161 113.836 268.941 117.026 266.291 119.336C264.451 120.956 262.581 122.106 260.061 122.096C253.811 122.096 247.561 122.096 241.311 122.096H238.701C237.931 123.266 238.201 124.376 238.201 125.426C238.201 149.926 238.201 174.422 238.201 198.916C238.201 207.916 235.131 215.486 228.261 221.416C225.257 224.091 221.651 226.002 217.751 226.986C217.041 227.156 216.491 227.306 216.221 227.986H52.7207Z"
                        fill="#F6AC0F"
                      />
                      <path
                        d="M143.757 71.1542H125.927C120.727 88.5742 115.217 106.294 109.017 123.774C102.817 141.254 96.2969 158.474 89.8269 175.984C87.7269 174.464 88.0069 171.984 87.2869 169.984C86.1669 166.884 85.6169 163.604 84.6169 160.454C83.6169 157.304 82.9969 153.984 82.2569 150.754C81.4469 146.954 80.3869 143.224 79.5569 139.444C78.8069 136.034 78.0669 132.614 77.2569 129.214C76.2569 125.034 75.5769 120.794 74.4569 116.624C73.4569 112.944 73.0469 109.104 72.1869 105.374C71.1869 101.104 70.7569 96.7242 69.4769 92.5142C68.9169 90.6442 68.9069 88.6642 68.4769 86.7342C67.3969 82.3942 67.1969 77.8242 66.1169 73.4842C65.0369 69.1442 64.8269 64.6242 63.4469 60.3442C62.9469 58.7942 63.6269 57.0142 62.5469 55.4042C64.0169 52.9042 66.4869 51.3442 68.6269 49.5142C73.8069 45.0742 79.1069 40.7842 84.3869 36.4642C92.8869 29.5342 101.387 22.6542 109.907 15.6842C114.387 11.9842 118.707 7.98423 123.307 4.33423C130.107 -1.07577 138.417 -1.66577 145.507 3.95423C155.067 11.5742 164.507 19.3442 173.927 27.1442C184.557 35.9842 195.107 44.8642 205.697 53.7242C206.117 54.0742 206.827 54.0642 206.897 54.3442C206.237 60.4042 204.997 65.9842 203.997 71.5642C202.897 77.3742 201.717 83.2042 200.547 89.0042C199.677 93.3042 198.787 97.6542 198.107 102.004C197.517 105.834 196.187 109.544 195.547 113.364C194.957 116.904 194.057 120.364 193.317 123.874C192.437 128.074 191.567 132.264 190.457 136.414C189.537 139.874 189.027 143.414 188.197 146.924C187.367 150.434 186.267 153.754 185.557 157.214C184.917 160.324 184.067 163.364 183.257 166.414C182.527 169.144 181.867 171.894 181.087 174.604C180.986 174.908 180.801 175.178 180.553 175.381C180.305 175.585 180.005 175.714 179.687 175.754C166.807 141.234 153.777 106.824 143.757 71.1542Z"
                        fill="#135996"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 76 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M39.4626 0.724971C39.9932 1.01742 43.4817 3.97099 43.9247 4.35044C42.4136 4.43874 37.5954 1.77359 36.173 1.81146C35.8524 1.82 35.461 1.94637 35.2319 2.15806C33.9205 3.37007 32.69 4.67125 31.3511 5.85087C29.9974 7.0435 28.5367 8.11455 27.1468 9.26744C25.9205 10.2846 24.756 11.377 23.5111 12.3701C22.2714 13.359 20.8663 14.1625 19.7302 15.251C19.1487 15.8081 18.6262 16.8555 18.7175 17.6037C19.0355 20.2125 19.5917 22.7961 20.1327 25.3735C21.3653 31.2457 22.6024 37.1176 23.9266 42.9697C24.3112 44.6694 24.9969 46.3015 25.5446 47.9646C25.4152 48.4742 25.2857 48.9837 25.1563 49.4933C25.062 49.5053 24.9678 49.5173 24.8736 49.5293C24.3534 47.6415 23.7592 45.7703 23.3263 43.8627C21.8332 37.2837 20.3729 30.697 18.9503 24.1025C18.4097 21.5967 17.9594 19.0684 17.58 16.5337C17.5095 16.0631 17.8357 15.3531 18.215 15.0254C20.6135 12.9532 23.0744 10.9527 25.5225 8.9379C28.3543 6.60719 31.1869 4.27737 34.036 1.96771C34.6453 1.47375 35.3266 1.06802 35.9818 0.521504C36.5343 0.15905 37.0685 -0.0754383 37.7893 0.0222632C38.51 0.119965 39.1837 0.571261 39.4626 0.724971Z"
                        fill="#B5B5C3"
                      />
                      <path
                        d="M0.00612782 29.7681C3.98701 26.4927 7.9679 23.2173 12.106 19.8125C12.5527 21.9537 12.964 23.9573 13.3895 25.9579C14.2268 29.8957 14.9158 33.8733 15.9499 37.759C17.5741 43.8618 19.4585 49.895 21.1653 55.9766C21.422 56.8914 21.8469 57.1275 22.6935 57.0638C23.4327 57.0082 24.1793 57.0522 24.9226 57.0522C27.1742 57.0522 27.1291 57.0359 27.9104 54.8688C31.0012 46.2949 34.1224 37.7319 37.2365 29.1663C37.2975 28.9985 37.4097 28.8492 37.5995 28.5101C38.1986 30.2721 38.7225 31.918 39.3154 33.5386C42.0438 40.9957 44.7982 48.4433 47.5231 55.9016C47.8506 56.7978 48.3571 57.1892 49.3444 57.0722C50.169 56.9746 51.0292 56.9531 51.8472 57.075C53.1311 57.2664 53.6788 56.7355 54.0689 55.5459C56.9586 46.7343 59.3438 37.7953 61.098 28.6873C61.6541 25.7997 62.2941 22.9284 62.9325 19.8734C64.0489 20.7491 65.1509 21.5882 66.2252 22.4616C68.7742 24.5339 71.2937 26.6428 73.8581 28.6957C75.105 29.6939 75.6779 31.1369 75.2145 32.4568C74.6843 33.9668 73.5629 34.7359 71.8655 34.7405C70.1032 34.7454 68.3409 34.7416 66.3806 34.7416C66.3806 35.2784 66.3806 35.7669 66.3806 36.2554C66.3806 42.9916 66.3518 49.728 66.3932 56.4639C66.4127 59.6375 64.9224 61.811 62.2376 63.3046C61.9672 63.455 61.7327 63.67 61.5605 63.9396C45.6445 64.0243 29.6494 64.0243 13.5218 63.9213C13.2014 63.6522 13.0368 63.4437 12.8222 63.3263C10.0039 61.7853 8.62414 59.4392 8.64133 56.205C8.67667 49.56 8.65195 42.9145 8.65195 36.2693C8.65195 35.7793 8.65195 35.2894 8.65195 34.7416C6.79489 34.7416 5.12417 34.6898 3.45825 34.757C1.95277 34.8177 0.819752 34.2714 0.000496588 32.9109C-0.00137387 31.7892 0.00237685 30.7786 0.00612782 29.7681Z"
                        fill="#DBDBE9"
                      />
                      <path
                        d="M25.4159 48.3693C24.7788 46.7372 24.085 45.0806 23.6958 43.3552C22.3558 37.4149 21.1039 31.4545 19.8567 25.4938C19.3092 22.8775 18.7464 20.255 18.4246 17.6069C18.3323 16.8474 18.8609 15.7842 19.4494 15.2187C20.5991 14.1138 22.0208 13.2981 23.2753 12.2944C24.535 11.2863 25.7134 10.1774 26.9543 9.14496C28.3608 7.9747 29.8388 6.8875 31.2086 5.67689C32.5635 4.47949 33.8086 3.1587 35.1356 1.92842C35.3674 1.71354 35.7635 1.58526 36.088 1.57659C37.5273 1.53816 39.4234 1.97835 40.997 1.97402C44.4634 4.71405 47.3361 7.04313 50.6767 9.77704C52.4873 11.2587 54.2449 12.8221 56.1651 14.1476C57.7925 15.2711 57.6984 16.6688 57.3529 18.2569C55.2152 28.0805 53.09 37.907 50.9377 47.7275C50.767 48.5068 50.4226 49.2481 49.8143 50.0155C46.9003 41.5873 43.9822 33.1606 41.0785 24.7289C40.7809 23.8646 40.5869 22.9652 40.3147 22.0915C39.7027 20.127 39.4981 20.0201 37.3294 20.2012C36.6433 20.2585 35.9484 20.2101 35.5263 20.2101C32.1375 29.7074 28.8181 39.0104 25.4159 48.3693Z"
                        fill="#B5B5C3"
                      />
                    </svg>
                  )}
                </span>
                <span className="menu-text">PV. Ang. Vgl. Leads</span>
              </NavLink>
            </li>
          } */}
          {
            <li
              className={`menu-item  ${
                !id && getMenuItemActive("/vattenfallteam", false)
              }`}
              aria-haspopup="true"
              onMouseEnter={() => setNewID(2)}
              onMouseLeave={() => setNewID("")}
            >
              <NavLink className="menu-link " to="/vattenfallteam">
                <span className="svg-icon menu-icon">
                  {getMenuItemActive("/vattenfallteam") || newId == "2" ? (
                    <svg
                      width="228"
                      height="230"
                      viewBox="0 0 228 230"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M113.689 0C50.9003 0 0 51.4871 0 115H227.379C227.379 51.4871 176.478 0 113.689 0Z"
                        fill="#F7D307"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M113.689 230C50.9003 230 0 178.513 0 115H227.379C227.379 178.513 176.478 230 113.689 230Z"
                        fill="#1E6EB0"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="74"
                      height="75"
                      viewBox="0 0 74 75"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M37 0C16.5654 0 0 17.0131 0 38H74C74 17.0131 57.4346 0 37 0Z"
                        fill="#DBDBE9"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M37 75C16.5654 75 0 58.4346 0 38H74C74 58.4346 57.4346 75 37 75Z"
                        fill="#B5B5C3"
                      />
                    </svg>
                  )}
                </span>
                <span className="menu-text">Vattenfall Leads</span>
              </NavLink>
            </li>
          }

          {userData && (
            <>
              <li
                className={`menu-item  ${getMenuItemActive("/newlead", false)}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link "
                  to="/newlead"
                  // onClick={() => updateNotificationNumber()}
                >
                  <span className="svg-icon menu-icon">
                    <div className="notification-icon-akignment">
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.04856 1.19083C8.85377 0.996108 8.58963 0.886719 8.31421 0.886719C8.03879 0.886719 7.77464 0.996108 7.57986 1.19083L0.675741 8.09391C0.627455 8.1422 0.589152 8.19952 0.56302 8.26261C0.536888 8.3257 0.523438 8.39332 0.523438 8.4616C0.523438 8.52989 0.536888 8.59751 0.56302 8.6606C0.589152 8.72369 0.627455 8.78101 0.675741 8.8293C0.773259 8.92682 0.905523 8.9816 1.04343 8.9816C1.11172 8.9816 1.17934 8.96815 1.24243 8.94202C1.30552 8.91589 1.36284 8.87758 1.41113 8.8293L8.31421 1.92518L15.2173 8.8293C15.3148 8.92682 15.4471 8.9816 15.585 8.9816C15.7229 8.9816 15.8552 8.92682 15.9527 8.8293C16.0502 8.73178 16.105 8.59952 16.105 8.4616C16.105 8.32369 16.0502 8.19143 15.9527 8.09391L13.5076 5.64989V2.22951C13.5076 2.09177 13.4529 1.95968 13.3555 1.86228C13.2581 1.76489 13.126 1.71017 12.9883 1.71017H11.9496C11.8119 1.71017 11.6798 1.76489 11.5824 1.86228C11.485 1.95968 11.4303 2.09177 11.4303 2.22951V3.57253L9.04856 1.19083Z"
                          fill="#9F9F9F"
                        />
                        <path
                          d="M8.31022 3.05078L14.5423 9.28287V13.6526C14.5423 14.0658 14.3782 14.4621 14.086 14.7543C13.7938 15.0465 13.3975 15.2106 12.9843 15.2106H3.63615C3.22293 15.2106 2.82665 15.0465 2.53446 14.7543C2.24227 14.4621 2.07813 14.0658 2.07812 13.6526V9.28287L8.31022 3.05078Z"
                          fill="#9F9F9F"
                        />
                      </svg>

                      {newLeadNumber > 0 && newLeadNumber != "0" && (
                        <div className="notification-number">
                          <div> {newLeadNumber}</div>
                        </div>
                      )}
                    </div>
                  </span>
                  <span className="menu-text">Neue Leads</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive(
                  "/projekte"
                )} ${getMenuItemActive("/vattenlead", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/projekte">
                  <span className="svg-icon menu-icon">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.777477 12.5885H7.16914V10.0885H2.66914C1.88581 10.0885 1.21081 10.6302 1.04414 11.3969L0.777477 12.5885ZM8.83581 12.5885H15.2275L14.9608 11.3969C14.8779 11.0271 14.672 10.6965 14.3769 10.4588C14.0817 10.2212 13.7147 10.0907 13.3358 10.0885H8.83581V12.5885ZM15.5941 14.2552H8.83581V17.5885H14.2608C15.3275 17.5885 16.1191 16.6052 15.8858 15.5635L15.5941 14.2552ZM1.74414 17.5885H7.16914V14.2552H0.410811L0.119144 15.5635C-0.11419 16.6052 0.677477 17.5885 1.74414 17.5885ZM8.00248 5.92188C7.54414 5.92188 7.16914 6.29688 7.16914 6.75521V7.58854C7.16914 8.04688 7.54414 8.42188 8.00248 8.42188C8.46081 8.42188 8.83581 8.04688 8.83581 7.58854V6.75521C8.83581 6.29688 8.46081 5.92188 8.00248 5.92188ZM13.4941 6.43854C13.5714 6.36145 13.6327 6.26987 13.6745 6.16906C13.7163 6.06825 13.7378 5.96018 13.7378 5.85104C13.7378 5.7419 13.7163 5.63383 13.6745 5.53302C13.6327 5.43221 13.5714 5.34064 13.4941 5.26354L12.9025 4.67188C12.8253 4.59472 12.7337 4.53352 12.6329 4.49177C12.5321 4.45002 12.4241 4.42852 12.315 4.42852C12.2059 4.42852 12.0978 4.45002 11.997 4.49177C11.8962 4.53352 11.8046 4.59472 11.7275 4.67188C11.6503 4.74903 11.5891 4.84062 11.5474 4.94142C11.5056 5.04223 11.4841 5.15027 11.4841 5.25937C11.4841 5.36848 11.5056 5.47652 11.5474 5.57733C11.5891 5.67813 11.6503 5.76972 11.7275 5.84687L12.3191 6.43854C12.6441 6.76354 13.1691 6.76354 13.4941 6.43854ZM3.68581 6.43854L4.27748 5.84687C4.35463 5.76972 4.41583 5.67813 4.45758 5.57733C4.49934 5.47652 4.52083 5.36848 4.52083 5.25937C4.52083 5.15027 4.49934 5.04223 4.45758 4.94142C4.41583 4.84062 4.35463 4.74903 4.27748 4.67188C4.20033 4.59472 4.10873 4.53352 4.00793 4.49177C3.90713 4.45002 3.79909 4.42852 3.68998 4.42852C3.58087 4.42852 3.47283 4.45002 3.37202 4.49177C3.27122 4.53352 3.17963 4.59472 3.10248 4.67188L2.51081 5.25521C2.43356 5.3323 2.37227 5.42388 2.33045 5.52469C2.28863 5.6255 2.26711 5.73357 2.26711 5.84271C2.26711 5.95185 2.28863 6.05992 2.33045 6.16073C2.37227 6.26154 2.43356 6.35311 2.51081 6.43021C2.83581 6.76354 3.36081 6.76354 3.68581 6.43854ZM2.16914 0.921875H1.33581C0.877477 0.921875 0.502477 1.29687 0.502477 1.75521C0.502477 2.21354 0.877477 2.58854 1.33581 2.58854H2.16914C2.62748 2.58854 3.00248 2.21354 3.00248 1.75521C3.00248 1.29687 2.62748 0.921875 2.16914 0.921875ZM14.6691 0.921875H13.8358C13.3775 0.921875 13.0025 1.29687 13.0025 1.75521C13.0025 2.21354 13.3775 2.58854 13.8358 2.58854H14.6691C15.1275 2.58854 15.5025 2.21354 15.5025 1.75521C15.5025 1.29687 15.1275 0.921875 14.6691 0.921875ZM8.00248 5.08854C10.3025 5.08854 12.1691 3.22187 12.1691 0.921875H3.83581C3.83581 3.22187 5.70248 5.08854 8.00248 5.08854Z"
                        fill="#9F9F9F"
                      />
                    </svg>
                  </span>
                  <span className="menu-text">Projekte</span>
                </NavLink>
              </li>

              <li
                className={`menu-item  ${getMenuItemActive("/archive", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link " to="/archive">
                  <span className="svg-icon menu-icon">
                    <svg
                      width="14"
                      height="18"
                      viewBox="0 0 14 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.0026 0.921875C12.4446 0.921875 12.8686 1.09747 13.1811 1.41003C13.4937 1.72259 13.6693 2.14651 13.6693 2.58854V10.9219H8.2526C7.92108 10.9219 7.60314 11.0536 7.36872 11.288C7.1343 11.5224 7.0026 11.8404 7.0026 12.1719V17.5885H2.0026C1.56058 17.5885 1.13665 17.4129 0.824093 17.1004C0.511532 16.7878 0.335938 16.3639 0.335938 15.9219V2.58854C0.335938 2.14651 0.511532 1.72259 0.824093 1.41003C1.13665 1.09747 1.56058 0.921875 2.0026 0.921875H12.0026ZM13.6334 12.5885C13.5665 12.9043 13.4093 13.1938 13.1809 13.4219L9.5026 17.1002C9.2745 17.3285 8.985 17.4857 8.66927 17.5527V12.5885H13.6334ZM5.33594 8.42188H4.5026C4.28159 8.42188 4.06963 8.50967 3.91335 8.66595C3.75707 8.82223 3.66927 9.03419 3.66927 9.25521C3.66927 9.47622 3.75707 9.68818 3.91335 9.84446C4.06963 10.0007 4.28159 10.0885 4.5026 10.0885H5.33594C5.55695 10.0885 5.76891 10.0007 5.92519 9.84446C6.08147 9.68818 6.16927 9.47622 6.16927 9.25521C6.16927 9.03419 6.08147 8.82223 5.92519 8.66595C5.76891 8.50967 5.55695 8.42188 5.33594 8.42188ZM9.5026 5.08854H4.5026C4.28159 5.08854 4.06963 5.17634 3.91335 5.33262C3.75707 5.4889 3.66927 5.70086 3.66927 5.92188C3.66927 6.14289 3.75707 6.35485 3.91335 6.51113C4.06963 6.66741 4.28159 6.75521 4.5026 6.75521H9.5026C9.72362 6.75521 9.93558 6.66741 10.0919 6.51113C10.2481 6.35485 10.3359 6.14289 10.3359 5.92188C10.3359 5.70086 10.2481 5.4889 10.0919 5.33262C9.93558 5.17634 9.72362 5.08854 9.5026 5.08854Z"
                        fill="#9F9F9F"
                      />
                    </svg>
                  </span>
                  <span className="menu-text">Archiv</span>
                </NavLink>
              </li>
              <li
                className={`menu-item  ${getMenuItemActive(
                  "/calendar",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link "
                  to="/calendar"
                  // onClick={() => updateNotificationNumber()}
                >
                  <span className="svg-icon menu-icon">
                    <svg
                      width="16"
                      height="19"
                      viewBox="0 0 16 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.5 8.25391V14.0872C15.5 14.5293 15.3244 14.9532 15.0118 15.2657C14.6993 15.5783 14.2754 15.7539 13.8333 15.7539H2.16667C1.72464 15.7539 1.30072 15.5783 0.988155 15.2657C0.675595 14.9532 0.5 14.5293 0.5 14.0872V8.25391H15.5ZM11.3333 0.753906C11.5543 0.753906 11.7663 0.841704 11.9226 0.997984C12.0789 1.15426 12.1667 1.36623 12.1667 1.58724V2.42057H13.8333C14.2754 2.42057 14.6993 2.59617 15.0118 2.90873C15.3244 3.22129 15.5 3.64521 15.5 4.08724V6.58724H0.5V4.08724C0.5 3.64521 0.675595 3.22129 0.988155 2.90873C1.30072 2.59617 1.72464 2.42057 2.16667 2.42057H3.83333V1.58724C3.83333 1.36623 3.92113 1.15426 4.07741 0.997984C4.23369 0.841704 4.44565 0.753906 4.66667 0.753906C4.88768 0.753906 5.09964 0.841704 5.25592 0.997984C5.4122 1.15426 5.5 1.36623 5.5 1.58724V2.42057H10.5V1.58724C10.5 1.36623 10.5878 1.15426 10.7441 0.997984C10.9004 0.841704 11.1123 0.753906 11.3333 0.753906Z"
                        fill="#9F9F9F"
                      />
                    </svg>
                  </span>
                  <span className="menu-text">Kalender</span>
                </NavLink>
              </li>
              {/* <li
                className={`menu-item  ${getMenuItemActive("/akedmie", false)}`}
                aria-haspopup="true"
              >
                <p className="menu-link ">
                  <span className="svg-icon menu-icon">
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8448 3.17013C11.2675 2.89608 10.6364 2.75391 9.99734 2.75391C9.35826 2.75391 8.72718 2.89608 8.14984 3.17013L2.57401 5.7843C1.67734 6.2043 1.44317 7.39013 1.87234 8.2093V12.3368C1.87234 12.5026 1.93819 12.6615 2.0554 12.7787C2.17261 12.896 2.33158 12.9618 2.49734 12.9618C2.6631 12.9618 2.82207 12.896 2.93928 12.7787C3.05649 12.6615 3.12234 12.5026 3.12234 12.3368V9.1468L8.14984 11.5035C8.72718 11.7775 9.35826 11.9197 9.99734 11.9197C10.6364 11.9197 11.2675 11.7775 11.8448 11.5035L17.4207 8.8893C18.634 8.32097 18.634 6.35263 17.4207 5.7843L11.8448 3.17013Z"
                        fill="#9F9F9F"
                      />
                      <path
                        d="M4.16406 11.0156V14.1073C4.16406 14.9473 4.58323 15.734 5.31823 16.1406C6.5424 16.8198 8.50073 17.7531 9.9974 17.7531C11.4941 17.7531 13.4524 16.819 14.6766 16.1415C15.4116 15.734 15.8307 14.9473 15.8307 14.1081V11.0156L12.3757 12.6356C11.6323 12.9876 10.82 13.1702 9.9974 13.1702C9.17483 13.1702 8.36252 12.9876 7.61906 12.6356L4.16406 11.0156Z"
                        fill="#9F9F9F"
                      />
                    </svg>
                  </span>
                  <span className="menu-text">Akademie</span>
                </p>
              </li> */}
            </>
          )}
          <li
            className={`menu-item  ${getMenuItemActive("/auth/login", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link " to="/auth/login">
              <span className="svg-icon menu-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.6224 5.668C4.62094 4.60215 5.00863 3.57242 5.71267 2.77219C6.4167 1.97195 7.38865 1.45625 8.446 1.32192C9.50336 1.18759 10.5734 1.44387 11.4552 2.04264C12.3369 2.64141 12.9698 3.54148 13.2349 4.57383C13.2799 4.73015 13.3842 4.86275 13.5254 4.94346C13.6667 5.02416 13.8338 5.04661 13.9914 5.00603C14.1489 4.96545 14.2844 4.86504 14.3691 4.72614C14.4538 4.58724 14.481 4.4208 14.4449 4.26217C14.1035 2.93558 13.2898 1.77916 12.1564 1.00988C11.023 0.240601 9.6478 -0.0886607 8.2889 0.083874C6.92999 0.256409 5.68075 0.918881 4.77556 1.94699C3.87037 2.9751 3.37144 4.29819 3.3724 5.668V7.3805C2.44323 7.44967 1.83906 7.62466 1.39656 8.06716C0.664062 8.79883 0.664063 9.978 0.664063 12.3347C0.664063 14.6913 0.664062 15.8705 1.39656 16.6022C2.12823 17.3347 3.3074 17.3347 5.66406 17.3347H12.3307C14.6874 17.3347 15.8666 17.3347 16.5982 16.6022C17.3307 15.8705 17.3307 14.6913 17.3307 12.3347C17.3307 9.978 17.3307 8.79883 16.5982 8.06716C15.8666 7.33466 14.6874 7.33466 12.3307 7.33466H5.66406C5.2874 7.33466 4.94156 7.33466 4.6224 7.338V5.668ZM5.66406 13.168C5.88508 13.168 6.09704 13.0802 6.25332 12.9239C6.4096 12.7676 6.4974 12.5557 6.4974 12.3347C6.4974 12.1137 6.4096 11.9017 6.25332 11.7454C6.09704 11.5891 5.88508 11.5013 5.66406 11.5013C5.44305 11.5013 5.23109 11.5891 5.07481 11.7454C4.91853 11.9017 4.83073 12.1137 4.83073 12.3347C4.83073 12.5557 4.91853 12.7676 5.07481 12.9239C5.23109 13.0802 5.44305 13.168 5.66406 13.168ZM8.99739 13.168C9.21841 13.168 9.43037 13.0802 9.58665 12.9239C9.74293 12.7676 9.83073 12.5557 9.83073 12.3347C9.83073 12.1137 9.74293 11.9017 9.58665 11.7454C9.43037 11.5891 9.21841 11.5013 8.99739 11.5013C8.77638 11.5013 8.56442 11.5891 8.40814 11.7454C8.25186 11.9017 8.16406 12.1137 8.16406 12.3347C8.16406 12.5557 8.25186 12.7676 8.40814 12.9239C8.56442 13.0802 8.77638 13.168 8.99739 13.168ZM13.1641 12.3347C13.1641 12.5557 13.0763 12.7676 12.92 12.9239C12.7637 13.0802 12.5517 13.168 12.3307 13.168C12.1097 13.168 11.8978 13.0802 11.7415 12.9239C11.5852 12.7676 11.4974 12.5557 11.4974 12.3347C11.4974 12.1137 11.5852 11.9017 11.7415 11.7454C11.8978 11.5891 12.1097 11.5013 12.3307 11.5013C12.5517 11.5013 12.7637 11.5891 12.92 11.7454C13.0763 11.9017 13.1641 12.1137 13.1641 12.3347Z"
                    fill="#9f9f9f"
                  />
                </svg>
              </span>
              <span className="menu-text" to="/auth/login" onClick={Logout}>
                Logout
              </span>
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
}
