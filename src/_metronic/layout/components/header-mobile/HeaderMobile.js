import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import Logo from "../../../../assets/icon/logo.svg";
import { getSocket } from "../../../../socket";
import { NotificatioContext } from "../../../../context/notificationContext";
import { getUserInfo } from "../../../../utils/user.util";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { QuickUserToggler } from "../extras/QuiclUserToggler";

export function HeaderMobile() {
  const uiService = useHtmlClassService();
  const { notificationNumber, setNotificationNumber } = useContext(NotificatioContext);

  const layoutProps = useMemo(() => {
    return {
      headerLogo: uiService.getStickyLogo(),
      asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
      headerMenuSelfDisplay: objectPath.get(uiService.config, "header.menu.self.display") === true,
      headerMobileCssClasses: uiService.getClasses("header_mobile", true),
      headerMobileAttributes: uiService.getAttributes("header_mobile"),
    };
  }, [uiService]);
  let userInfo = getUserInfo();
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
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
      };

      socket.on("connect", handleConnect);
      socket.on("check-notification", handleCheckNotification);

      if (socket.connected) {
        handleConnect();
      }
      return () => {
        socket.off("connect", handleConnect);
        socket.off("check-notification", handleCheckNotification);
      };
    } else {
      console.error("Socket not available");
    }
  }, [socket?.id]);

  return (
    <>
      {/*begin::Header Mobile*/}
      <div id="kt_header_mobile" className={`header-mobile align-items-center ${layoutProps.headerMobileCssClasses}`} {...layoutProps.headerMobileAttributes}>
        {/*begin::Logo*/}
        <div className="logo-div-main">
          <Link to="/">
            <img alt="logo" src={Logo} />
          </Link>

          <div className="d-flex align-items-center">
            {layoutProps.asideDisplay && (
              <>
                {/*begin::Aside Mobile Toggle*/}
                <button className="btn p-0 burger-icon burger-icon-left" id="kt_aside_mobile_toggle">
                  <span />
                </button>
                {/*end::Aside Mobile Toggle*/}
              </>
            )}

            {layoutProps.headerMenuSelfDisplay && (
              <>
                {/*begin::Header Menu Mobile Toggle*/}
                {/* <button className="btn p-0 burger-icon ml-4" id="kt_header_mobile_toggle">
                    <span/>
                  </button> */}
                {/*end::Header Menu Mobile Toggle*/}
              </>
            )}

            {/*begin::Topbar Mobile Toggle*/}
            <button className="btn btn-hover-text-primary p-0 ml-2 person-icon" id="kt_header_mobile_topbar_toggle">
              <span className="svg-icon svg-icon-xl">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
              </span>
            </button>
            {/*end::Topbar Mobile Toggle*/}
          </div>
        </div>
        {/*end::Logo*/}

        <div className="user-div-header-mobile-main">
          <div className="justify-content-design-sc">
            <div>
              {userInfo?.role == "user" && (
                <Link to="/mitteilungen">
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
                </Link>
              )}
            </div>
            <div className="navbar-alignment-new">
              <div style={{ marginRight: "0" }}>
                {" "}
                <QuickUserToggler />
              </div>
              {/* {userInfo?.role == "user" && (
                <div className="first-char-design">
                  {" "}
                  <span>{userInfo?.role == "user" && userInfo?.name?.charAt(0).toUpperCase()}</span>
                </div>
              )} */}
            </div>
          </div>

          <span className="menu-text-sc">
            {userInfo?.role == "admin" ? "WEPRO |" : ""} {userInfo?.role == "admin" ? "admin" : `2Park | ${userInfo?.name}`}
          </span>
        </div>
      </div>
      {/*end::Header Mobile*/}
    </>
  );
}
