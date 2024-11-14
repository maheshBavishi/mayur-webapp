import React, { useContext, useEffect, useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { QuickUserToggler } from "../extras/QuiclUserToggler";
import { getUserInfo } from "../../../../utils/user.util";
import { getSocket } from "../../../../socket";
import { NavLink } from "reactstrap";
import "./topbar.scss";
import { NotificatioContext } from "../../../../context/notificationContext";
import { ApiGet } from "../../../../helpers/API/ApiData";

export function Topbar() {
  const { notificationNumber, setNotificationNumber,newLeadNumber,setNewLeadNumber } = useContext(NotificatioContext);
  let userInfo = getUserInfo();
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(uiService.config, "extras.search.display"),
      viewNotificationsDisplay: objectPath.get(uiService.config, "extras.notifications.display"),
      viewQuickActionsDisplay: objectPath.get(uiService.config, "extras.quick-actions.display"),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(uiService.config, "extras.quick-panel.display"),
      viewLanguagesDisplay: objectPath.get(uiService.config, "extras.languages.display"),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);
  const socket = getSocket();
  const handleCheckNotification = (response) => {
    setNotificationNumber(response?.data ? response?.data : response?.unreadNotification);
  };
  const updateNotificationNumber = () => {
    socket.emit("update-notification", {});
    socket.on("update-notification", (response) => {
      setNotificationNumber(response?.data);
    });
  };

  const handleNewleadNotification=()=>{
    socket.on("check-new-lead", (response) => {
      setNewLeadNumber(response?.data)
    });

  }
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
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

  const[userData,setUserData]=useState(false)
  const localData = JSON.parse(localStorage.getItem("userinfo"));
  const getData = async () => {
    try {
      let resp = await ApiGet(`user/get?userId=${localData?.userId}`);
      setUserData(resp?.data?.payload?.data?.[0]?.
        PVVertrieb)
    } catch (error) {
      console.error(error);
    }
  };
     useEffect(()=>{
      getData()
     },[])

  return (
    <div className="topbar w-100 flex-design">
      <div className="main-navbar-alignment">
        <div className="item-xxx" style={{ fontSize: "14px", fontWeight: "500" }}>
          <span className="menu-text">
            {userInfo?.role == "admin" ? "WEPRO |" : ""} {userInfo?.role == "admin" ? "admin" : `2Park | ${userInfo?.name}`}
          </span>
        </div>
        <div className="justify-content-design">
          <div>
            {userInfo?.role == "user" && (
              <NavLink href="/mitteilungen">
                <div className="notification-icon-akignment" onClick={() => updateNotificationNumber()}>
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.5179 23H15.482M18.9641 8.53333C18.9641 6.80059 18.2304 5.13881 16.9243 3.91357C15.6183 2.68833 13.847 2 12 2C10.153 2 8.38161 2.68833 7.07558 3.91357C5.76956 5.13881 5.03583 6.80059 5.03583 8.53333C5.03583 11.6672 4.25098 13.8807 3.32666 15.401C2.43142 16.8734 1.98381 17.6096 2.00045 17.8009C2.01915 18.0156 2.06133 18.0912 2.23395 18.2193C2.38762 18.3333 3.11794 18.3333 4.57858 18.3333H19.4214C20.882 18.3333 21.6124 18.3333 21.766 18.2193C21.9386 18.0912 21.9809 18.0156 21.9996 17.8009C22.0162 17.6096 21.5685 16.8734 20.6733 15.401C19.749 13.8807 18.9641 11.6672 18.9641 8.53333Z"
                      stroke="black"
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
              </NavLink>
            )}
          </div>
          <div>
            {userData && (
              <NavLink href="/newlead">
                <div className="notification-icon-akignment" onClick={() => handleNewleadNotification()}>
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.0689 0.782944C12.7876 0.501728 12.4062 0.34375 12.0084 0.34375C11.6107 0.34375 11.2293 0.501728 10.948 0.782944L0.977754 10.7523C0.908024 10.822 0.852711 10.9048 0.814973 10.9959C0.777236 11.087 0.757813 11.1847 0.757812 11.2833C0.757813 11.3819 0.777236 11.4796 0.814973 11.5707C0.852711 11.6618 0.908024 11.7446 0.977754 11.8143C1.11858 11.9551 1.30958 12.0342 1.50874 12.0342C1.60735 12.0342 1.705 12.0148 1.79611 11.9771C1.88721 11.9393 1.96999 11.884 2.03972 11.8143L12.0084 1.84348L21.9772 11.8143C22.118 11.9551 22.309 12.0342 22.5081 12.0342C22.7073 12.0342 22.8983 11.9551 23.0391 11.8143C23.18 11.6735 23.2591 11.4824 23.2591 11.2833C23.2591 11.0841 23.18 10.8931 23.0391 10.7523L19.5082 7.22265V2.28299C19.5082 2.08407 19.4292 1.8933 19.2886 1.75264C19.1479 1.61199 18.9572 1.53297 18.7583 1.53297H17.2583C17.0594 1.53297 16.8686 1.61199 16.728 1.75264C16.5873 1.8933 16.5083 2.08407 16.5083 2.28299V4.22255L13.0689 0.782944Z" fill="black"/>
<path d="M12.0076 3.46875L21.0073 12.469V18.7797C21.0073 19.3765 20.7703 19.9488 20.3483 20.3708C19.9264 20.7927 19.3541 21.0298 18.7574 21.0298H5.25775C4.66103 21.0298 4.08875 20.7927 3.6668 20.3708C3.24486 19.9488 3.00781 19.3765 3.00781 18.7797V12.469L12.0076 3.46875Z" fill="black"/>
</svg>

                  {(newLeadNumber > 0  && newLeadNumber !="0") && (
                    <div className="notification-number">
                      <div> {newLeadNumber}</div>
                    </div>
                  )}
                </div>
              </NavLink>
            )}
          </div>
          <div className="navbar-alignment-new">
            <div style={{ marginRight: "0" }}> {layoutProps.viewUserDisplay && <QuickUserToggler />}</div>
            {/* {userInfo?.role == "user" && (
              <div className="first-char-design">
                {" "}
                <span>{userInfo?.role == "user" && userInfo?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
