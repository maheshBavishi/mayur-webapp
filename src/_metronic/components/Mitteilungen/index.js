import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import "./Mitteilungen.scss";
import { getSocket } from "../../../socket";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import Loader from "../../../helpers/loader";
import { NotificatioContext } from "../../../context/notificationContext";
import NotificationLogo from "../../../assets/icon/notification.svg";
import closeIcon from "../../../assets/icon/icons8-close-24.png"
import { useParams } from 'react-router-dom';
function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
  useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return isIntersecting;
}

export default function Mitteilungen() {
  const divRef = useRef();
  const { notificationNumber, setNotificationNumber } = useContext(NotificatioContext);
  const [showDetail, setShowDetail] = useState();
  const [loadedData, setLoadedData] = useState([]);
  const [model, setModel] = useState(false)
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const isVisible = useOnScreen(divRef);

  const socket = getSocket();
  const handleCheckNotification = (data) => {
    setNotificationNumber(data?.data ? data?.data : data?.unreadNotification);
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

  const loadInitialData = async (initialPage) => {
    setLoading(true);

    try {
      const response = await ApiGet(`notification/getUserNotification?page=${initialPage || page}&limit=${pageSize}`);
      const initialData = response?.data?.payload;
      if (initialPage) {
        setPage(initialPage + 1);
        setLoadedData((prevData) => [...initialData]);
      } else {
        setPage((prevPage) => prevPage + 1);
        setLoadedData(loadedData.concat(initialData));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isVisible && !loading) {
      loadInitialData();
    }
  }, [isVisible, notificationNumber]);
  useEffect(() => {
    loadInitialData(1);
  }, [notificationNumber]);
  const showDetails = (data, isRead) => {
    const updateIsRead = () => {
      setLoadedData((prevData) => prevData.map((item) => (item._id === data?._id ? { ...item, isRead: true } : item)));
    };

    if (data) {
      setShowDetail(data);
      {
        !isRead && socket.emit("update-read-notification", { id: data?._id });
        updateIsRead();
      }
    }
  };
  const pinData = (data) => {
    setLoading(true);
    if (data.isPinned === true) {
      ApiPut(`notification/unPinNotification?id=${data._id}`)
        .then((res) => {
          toast.success("Die Daten wurden erfolgreich gelöst");
          loadInitialData(1);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } else {
      ApiPut(`notification/pinNotification?id=${data._id}`)
        .then((res) => {
          toast.success("Daten erfolgreich angeheftet");
          loadInitialData(1);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="mitteilungen-all-contnet-alignments">
        <div className="grid">
          <div className="grid-items-data">
            <div className="all-data-align-notification">
              {loadedData &&
                loadedData?.map((item, index) => {
                  return (
                    <div className={showDetail?._id == item?._id ? "sub-boxs active " : "sub-boxs"}>
                      <div className={item?.isPinned ? "line-class" : showDetail?._id !== item?._id ? "new-line-class " : "new-line-design"}></div>
                      <div onClick={(e) => {
                        showDetails(item, item?.isRead);
                        setModel(true)
                      }}>
                        {item?.isPinned ? <p style={{ color: "#2C4570" }}>{item?.title}</p> : item?.isRead ? <p style={{ color: "#ACACAC" }}>{item?.title}</p> : <p style={{ color: "#585858" }}>{item?.title}</p>}
                        <span>WePro Admin</span>

                        <h6>{moment(item?.createdAt).tz("Europe/Paris").format("MMMM Do YYYY, h:mm:ss a")}</h6>
                      </div>

                      <div onClick={() => pinData(item)} style={{ marginTop: "12px" }}>
                        {item.isPinned === true ? (
                          <svg width="18" height="27" viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_300_305)">
                              <path
                                d="M2.73725 0.737251C2.81284 0.661848 2.90256 0.602084 3.00126 0.561375C3.09997 0.520666 3.20573 0.499811 3.3125 0.500001H14.6875C14.903 0.500001 15.1097 0.585604 15.262 0.737977C15.4144 0.89035 15.5 1.09701 15.5 1.3125C15.5 2.4175 14.9443 3.22025 14.4503 3.71588C14.2455 3.919 14.044 4.07988 13.875 4.20013V11.4005L14.0017 11.4785C14.3316 11.6849 14.7753 11.9888 15.2221 12.3804C16.085 13.1344 17.125 14.3564 17.125 15.9375C17.125 16.153 17.0394 16.3597 16.887 16.512C16.7347 16.6644 16.528 16.75 16.3125 16.75H9.8125V24.0625C9.8125 24.511 9.4485 26.5 9 26.5C8.5515 26.5 8.1875 24.511 8.1875 24.0625V16.75H1.6875C1.47201 16.75 1.26535 16.6644 1.11298 16.512C0.960603 16.3597 0.875 16.153 0.875 15.9375C0.875 14.3564 1.915 13.1344 2.77625 12.3804C3.19703 12.0158 3.64827 11.688 4.125 11.4005V4.20013C3.92107 4.05376 3.72875 3.89186 3.54975 3.71588C3.05575 3.22025 2.5 2.41588 2.5 1.3125C2.49981 1.20573 2.52066 1.09997 2.56137 1.00126C2.60208 0.902559 2.66185 0.812845 2.73725 0.737251Z"
                                fill="#2c4570"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_300_305">
                                <rect width="18" height="27" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        ) : (
                          <svg width="18" height="27" viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M2.73725 0.737251C2.81284 0.661848 2.90256 0.602084 3.00126 0.561375C3.09997 0.520666 3.20573 0.499811 3.3125 0.500001H14.6875C14.903 0.500001 15.1097 0.585604 15.262 0.737977C15.4144 0.89035 15.5 1.09701 15.5 1.3125C15.5 2.4175 14.9443 3.22025 14.4503 3.71588C14.2455 3.919 14.044 4.07988 13.875 4.20013V11.4005L14.0017 11.4785C14.3316 11.6849 14.7753 11.9888 15.2221 12.3804C16.085 13.1344 17.125 14.3564 17.125 15.9375C17.125 16.153 17.0394 16.3597 16.887 16.512C16.7347 16.6644 16.528 16.75 16.3125 16.75H9.8125V24.0625C9.8125 24.511 9.4485 26.5 9 26.5C8.5515 26.5 8.1875 24.511 8.1875 24.0625V16.75H1.6875C1.47201 16.75 1.26535 16.6644 1.11298 16.512C0.960603 16.3597 0.875 16.153 0.875 15.9375C0.875 14.3564 1.915 13.1344 2.77625 12.3804C3.19703 12.0158 3.64827 11.688 4.125 11.4005V4.20013C3.92107 4.05376 3.72875 3.89186 3.54975 3.71588C3.05575 3.22025 2.5 2.41588 2.5 1.3125C2.49981 1.20573 2.52066 1.09997 2.56137 1.00126C2.60208 0.902559 2.66185 0.812845 2.73725 0.737251ZM5.3015 3.02363L5.30475 3.02525C5.43868 3.09312 5.5512 3.19677 5.62979 3.32471C5.70839 3.45264 5.75 3.59985 5.75 3.75V11.875C5.74999 12.0258 5.70804 12.1736 5.62883 12.3018C5.54963 12.4301 5.43629 12.5338 5.3015 12.6014H5.29825L5.27875 12.6128L5.191 12.6615C4.71237 12.9295 4.26212 13.2453 3.84713 13.604C3.33037 14.0558 2.8965 14.5725 2.669 15.125H15.331C15.1035 14.5725 14.6696 14.0558 14.1529 13.604C13.7126 13.2233 13.2326 12.8909 12.7212 12.6128L12.7017 12.603H12.6985C12.5635 12.5353 12.45 12.4314 12.3707 12.3028C12.2915 12.1742 12.2497 12.026 12.25 11.875V3.75C12.2494 3.59288 12.2943 3.43895 12.3794 3.30686C12.4645 3.17476 12.5861 3.07017 12.7294 3.00575C12.9369 2.88303 13.1285 2.73512 13.2997 2.56538C13.4297 2.43538 13.5516 2.28913 13.6475 2.125H4.3525C4.45108 2.2875 4.567 2.43429 4.70025 2.56538C4.88 2.74349 5.0821 2.89753 5.3015 3.02363Z"
                              fill="#C6C6C6"
                            />
                          </svg>
                        )}
                      </div>
                      {/* <div ref={divRef}></div> */}
                    </div>
                  );
                })}
              <div ref={divRef}></div>
            </div>
          </div>

          {

            model ?
              <>

                {showDetail ? (
                  <div className="grid-items-data">
                    <div className="neues-sticky-section">
                      <div className="icon-align">
                        <img src={closeIcon} alt="icon" onClick={() => setModel(false)} />
                      </div>
                      <div className="neues-all-contetent-alignment">
                        <button>WePro Admin</button>
                        <span>{showDetail?.title}</span>
                      </div>
                      <div className="all-list-alignment">
                        <p>{showDetail?.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                  // <div className="grid-items-data">
                  //   <div className="neues-sticky-section">
                  //     <div className="center-data-align">
                  //       <img src={NotificationLogo} alt="notification" />
                  //       <span>Bitte klicken Sie auf die Benachrichtigung, um sie anzusehen</span>
                  //     </div>
                  //   </div>
                  // </div>
                )}
              </>
              : <>
              {/* <div className="no-notification">
              <div className="grid-items-data">
                  <div className="neues-sticky-section">
                    <div className="center-data-align">
                      <img src={NotificationLogo} alt="notification" />
                      <span>Bitte klicken Sie auf die Benachrichtigung, um sie anzusehen</span>
                    </div>
                  </div>
                </div>
              </div> */}
                </>}


        </div>
      </div>
    </>
  );
}
