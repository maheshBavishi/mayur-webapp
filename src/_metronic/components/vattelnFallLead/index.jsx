import React, { useEffect, useRef, useState } from "react";
import "moment-timezone";
import { ApiGet, ApiGetNoAuth, ApiPut } from "../../../helpers/API/ApiData";
import "../Team/tema.scss";
import CustomCalendar from "../Calendar/calender";
import moment from "moment";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

import { useLocation } from "react-router-dom";

export default function VattelnFallLead() {
  const [leadData, setLeadData] = useState({});
  const [appoinmentData, setAppoinmentData] = useState();
  const [modal, setModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [ownMessage, setOwnMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState();
  const [meetingDate, setMeetingDate] = useState();
  const [noteModel, setNoteModel] = useState(false);
  const [type, setType] = useState("add");
  const [note, setNote] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [loading, setLoading] = useState(false);
  const [itShow, setItShow] = useState("");
  const ref = useRef();


  const url = window.location.href;
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");
  const location = useLocation();

  const getDataById = async () => {
    try {
      let response = await ApiGet(`vattenfall/getLead?id=${id}`);
      setOwnMessage(response?.data?.payload?.leadNotes)
      setLeadData(response?.data?.payload);
      setLeadStatus(response?.data?.payload?.status);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    leadData && getDataById();
  }, []);

  const handleInput = (e) => {
    setOwnMessage(e.target.value);
  };

  const handleCalendar = () => {
    setModal(!modal);
  };

  const handleStatus = async (statuss) => {
    setToggle(!toggle);
    setLeadStatus(statuss);

    try {
      let body = {
        status: statuss,
      };
      let resp = await ApiPut(
        `vattenfall/updateLeadVatten${id ? `?id=${id}` : ""}`,
        body
      );
      toast.success("Status erfolgreich verändert.");
      console.log(
        " window.location.href = '/new-path';",
        resp?.data?.payload?.status == "VERKAUFT"
      );
      if (resp?.data?.payload?.status == "VERKAUFT") {
        window.location.href = "/archive";
      }
    } catch (error) {
      toast.error("Failed to update lead status");
      console.log(error);
    }
  };

  const getAppointment = async () => {
    try {
      let response = await ApiGet(`vattenfall/getAppointment?leadId=${id}`);
      setAppoinmentData(response?.data?.payload);
      setNote(response?.data?.payload);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointment();
  }, []);

  const today = new Date();
  const results =
    appoinmentData &&
    appoinmentData?.map((appointment) => {
      return new Date(appointment.appointmentDate) > today;
    });

  const updateMeeting = (item) => {

    setMeetingDate(item);
    setModal(!modal);
    setType("update");
  };

  
  const status = leadStatus !== "offen" ? [
    "AUFMAß",
    "offen",
    "ZEITLICHE VERZÖGERUNG",
    "SPÄTER ANRUFEN",
    "STORNO",
    "ANGEBOTSBESPRECHUNG",
    "ANGEBOTSBESPRECHUNG 2",
    "ABSAGE",
    "VERKAUFT",
    
  ] :["ZEITLICHE VERZÖGERUNG", "SPÄTER ANRUFEN","STORNO","NICHT ERREICHT"];

  const handleModels = (items) => {
    setSelectedItem(items);
    setNoteModel(!noteModel);
    let filterData = appoinmentData?.filter((item) => {
      return items?._id == item?._id;
    });
    setNote(filterData?.[0]);
  };

  const handleModelsChange = (e) => {
    setNote({ ...note, notes: e.target.value });
  };

  const updateNotes = async () => {
    try {
      const body = {
        notes: note?.notes,
      };
      setLoading(true);
      let response = await ApiPut(
        `vattenfall/updateAppointment?id=${selectedItem?._id}`,
        body
      );
      getAppointment();
      setLoading(false);
      setNoteModel(!noteModel);
      toast.success("Notizen aktualisiert");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.success("Something went wrong!");
    }
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSchedualMeeting = async () => {
    if (ownMessage?.trim()) {
      try {
        let body = {
          leadNotes: ownMessage,
        };

        let resp = await ApiPut(
          `vattenfall/updateLeadVatten${id ? `?id=${id}` : ""}`,
          body
        );
        toast.success("message updated");
        getDataById()
        setLoading(false);
      } catch (error) {
        toast.error("Fehler bei der Planung des Meetings");
        setLoading(false);
        console.log(error);
      }
    } 
  };


  const handleChangeInput=(e)=>{
    const {name,value}=e.target
    setLeadData({...leadData,[name]:value})
  }
  const handleUserDetails = async () => {
   

    try {
      setLoading(true)
      let body = {
           name:leadData?.name,
           nachname :leadData?.nachname,
           telephon:leadData?.telephon,
           email:leadData?.email,
           strabe:leadData?.strabe,
           pLZ:leadData?.pLZ,
           location:leadData?.location,
           housetype:leadData?.housetype,
           satteldach:leadData?.satteldach,
           power_consumption:leadData?.power_consumption,
           roofFelt:leadData?.roofFelt,
           schornstein:leadData?.schornstein,
           aktuellkeinEAuto:leadData?.aktuellkeinEAuto,
           rooftype:leadData?.rooftype,
           notizen:leadData?.notizen,
           accessibility:leadData?.accessibility

      };
      let resp = await ApiPut(
        `vattenfall/updateLeadVatten?id=${id}`,
        body
      );
      getAppointment()
      toast.success("Leaddaten aktualisiert");
    } catch (error) {
      toast.error("Failed update data");
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      {!modal ? (
        <div className="VattelnFallLead-main">
          <div className="VattelnFallLead-container">
            <div className="VattelnFallLead-title">
              <p>
                {`Terminierung "${leadData?.name} ${leadData?.nachname}" in "${leadData?.location}" errreichbar unter:
                "${leadData?.telephon}"`}
              </p>
            </div>
            <div
              ref={dropdownRef}
              onClick={() => setToggle(!toggle)}
              className={
             ( leadStatus == "STORNO" ||  leadStatus == "ABSAGE" )
                  ? "offen-ticket-div"
                  : leadStatus == "VERKAUFT"
                  ? "offen-ticket-div-status-col-2"
                  : "offen-ticket-div-status-col"
              }
              
            >
              <span
                className={
                  ( leadStatus == "STORNO" ||  leadStatus == "ABSAGE" )
                    ? "status-color"
                    : leadStatus == "VERKAUFT"
                    ? "final-status-green"
                    : "status-color-new"
                }
              >
                {leadStatus?.toUpperCase()}
              </span>
              <div
                className={( leadStatus == "VERKAUFT" || leadStatus == "ABSAGE") ? "display-no" : "display-yes"}
              >
                {" "}
                { !toggle ? (
                  <svg
                    width="18"
                    height="11"
                    viewBox="0 0 18 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.54661 9.93141L17.5116 1.57191C17.6446 1.43243 17.7187 1.24712 17.7187 1.05441C17.7187 0.861706 17.6446 0.676395 17.5116 0.536913L17.5026 0.527912C17.4381 0.460059 17.3606 0.40603 17.2746 0.369109C17.1886 0.332189 17.0959 0.31315 17.0024 0.31315C16.9088 0.31315 16.8162 0.332189 16.7302 0.369109C16.6442 0.40603 16.5666 0.460059 16.5021 0.527912L9.00211 8.39991L1.50511 0.527914C1.44065 0.460061 1.36306 0.406031 1.27706 0.369111C1.19106 0.33219 1.09845 0.313151 1.00486 0.313151C0.911267 0.313151 0.818656 0.33219 0.732658 0.369111C0.646657 0.406031 0.569068 0.460061 0.504607 0.527914L0.495607 0.536914C0.36264 0.676397 0.288463 0.861707 0.288463 1.05441C0.288463 1.24712 0.36264 1.43243 0.495607 1.57191L8.46061 9.93141C8.53065 10.0049 8.6149 10.0635 8.70824 10.1035C8.80158 10.1434 8.90206 10.1641 9.00361 10.1641C9.10515 10.1641 9.20564 10.1434 9.29898 10.1035C9.39232 10.0635 9.47656 10.0049 9.54661 9.93141Z"
                      fill={leadStatus == "VERKAUFT" ? "white" : "black"}
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="11"
                    viewBox="0 0 18 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.45339 1.06859L0.488393 9.42809C0.355426 9.56757 0.28125 9.75288 0.28125 9.94559C0.28125 10.1383 0.355426 10.3236 0.488393 10.4631L0.497393 10.4721C0.561853 10.5399 0.639443 10.594 0.725442 10.6309C0.811442 10.6678 0.904053 10.6869 0.997643 10.6869C1.09123 10.6869 1.18384 10.6678 1.26984 10.6309C1.35584 10.594 1.43343 10.5399 1.49789 10.4721L8.99789 2.60009L16.4949 10.4721C16.5594 10.5399 16.6369 10.594 16.7229 10.6309C16.8089 10.6678 16.9016 10.6869 16.9951 10.6869C17.0887 10.6869 17.1813 10.6678 17.2673 10.6309C17.3533 10.594 17.4309 10.5399 17.4954 10.4721L17.5044 10.4631C17.6374 10.3236 17.7115 10.1383 17.7115 9.94559C17.7115 9.75288 17.6374 9.56757 17.5044 9.42809L9.53939 1.06859C9.46935 0.99507 9.3851 0.936541 9.29176 0.89655C9.19842 0.856559 9.09794 0.835938 8.99639 0.835938C8.89485 0.835938 8.79436 0.856559 8.70102 0.89655C8.60768 0.936541 8.52344 0.99507 8.45339 1.06859Z"
                      fill={leadStatus == "VERKAUFT" ? "white" : "black"}
                    />
                  </svg>
                )}
              </div>
              {toggle &&
                (leadStatus !== "VERKAUFT") && (
                  <div className="oppen-ticket-dropdown-scroll">
                    <div className="oppen-ticket-dropdown-main">
                      <div className="oppen-ticket-dropdown-content">
                        {status?.map((item, i) => {
                          return (
                            <p key={i} onClick={() => handleStatus(item)}>
                              {item}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="VattelnFallLead-main-content">
              <div className="VattelnFallLead-main-content-one">
                <div>
                  <label>Vorname</label>
                  <input
                    type="text"
                    placeholder="Vorname"
                    name="name"
                    value={leadData?.name}
                     onChange={(e)=>handleChangeInput(e)}
                    
                  />
                </div>
                <div>
                  <label>Nachname</label>
                  <input
                    type="text"
                    placeholder="Nachname"
                    name="nachname"
                    value={leadData?.nachname}
                    onChange={(e)=>handleChangeInput(e)}
                  />
                </div>
                <div>
                  <label>Telefon</label>
                  <input
                    type="text"
                    placeholder="Telefon"
                    name="telephon"
                    value={leadData?.telephon}
                    onChange={(e)=>handleChangeInput(e)}
                  />
                </div>
                <div className="email-input-mobile">
                  <label>E-Mail</label>
                  <input
                    type="text"
                    placeholder="E-Mail"
                    name="email"
                    onChange={(e)=>handleChangeInput(e)}
                    value={leadData?.email}
                  />
                </div>
              </div>
              <div className="VattelnFallLead-main-content-one">
                <div>
                  <label>Straße und Hausnummer</label>
                  <input
                    type="text"
                    placeholder="Straße und Hausnummer"
                    name="strabe"
                    onChange={(e)=>handleChangeInput(e)}
                    value={leadData?.strabe}
                  />
                </div>
                <div className="postleitzahl-inputs-main">
                  <div>
                    <label>Postleitzahl</label>
                    <input
                      type="text"
                      placeholder="Postleitzahl"
                      name="pLZ"
                      onChange={(e)=>handleChangeInput(e)}
                      value={leadData?.pLZ}
                    />
                  </div>
                  <div>
                    <label>Ort</label>
                    <input
                      type="text"
                      placeholder="Ort"
                      name="location"
                      onChange={(e)=>handleChangeInput(e)}
                      value={leadData?.location}
                    />
                  </div>
                </div>
                <div className="email-input-web">
                  <label>E-Mail</label>
                  <input
                    type="text"
                    placeholder="E-Mail"
                    name="email"
                    onChange={(e)=>handleChangeInput(e)}
                    value={leadData?.email}
                  />
                </div>
              </div>
              <h2>Informationen</h2>
              <div className="VattelnFallLead-main-content-one">
                <div className="postleitzahl-inputs-main">
                  <div>
                    <label>Haustyp</label>
                    <input
                      type="text"
                      placeholder="Haustyp"
                      name="housetype"
                      onChange={(e)=>handleChangeInput(e)}
                      value={leadData?.housetype}
                    />
                  </div>
                  <div>
                    <label>Dachtyp</label>
                    <input
                      type="text"
                      placeholder="Dachtyp"
                      name="satteldach"
                      value={leadData?.satteldach}
                      onChange={(e)=>handleChangeInput(e)}
                    />
                  </div>
                </div>
                <div>
                  <label>Stromverbrauch</label>
                  <input
                    type="text"
                    placeholder="Stromverbrauch"
                    name="power_consumption"
                    onChange={(e)=>handleChangeInput(e)}
                    value={leadData?.power_consumption}
                  />
                </div>
              </div>
              <div className="VattelnFallLead-main-content-one">
                <div className="postleitzahl-inputs-main">
                  <div>
                    <label>Dachbelegung</label>
                    <input
                      type="text"
                      placeholder="Dachbelegung"
                      name="roofFelt"
                      onChange={(e)=>handleChangeInput(e)}
                      value={leadData?.roofFelt}
                    />
                  </div>
                  <div>
                    <label>Störfaktoren</label>
                    <input
                      type="text"
                      placeholder="Störfaktoren"
                      name="schornstein"
                      onChange={(e)=>handleChangeInput(e)}
                      value={leadData?.schornstein
                        ?.map((item) => item)
                        .join(",")}
                        disabled
                    />
                  </div>
                </div>
              </div>
              <div className="zusatz-div-alignment-main">
                <div>
                  <h2>Zusatz</h2>
                  <div className="zusatz-inputs-main">
                    <div>
                      <label>E-Auto</label>
                      <input
                        type="text"
                        placeholder="E-Auto"
                        name="aktuellkeinEAuto"
                        value={leadData?.aktuellkeinEAuto}
                        onChange={(e)=>handleChangeInput(e)}
                      />
                    </div>
                    <div className="ort-input">
                      <label>Wärmepumpe</label>
                      <input
                        type="text"
                        placeholder="Wärmepumpe"
                        name="rooftype"
                        onChange={(e)=>handleChangeInput(e)}
                        value={leadData?.rooftype}
                      />
                    </div>
                    <div>
                      <label>Erreichbarkeit</label>
                      <input
                        type="text"
                        placeholder="Erreichbarkeit"
                        name="accessibility"
                        value={leadData?.accessibility}
                        onChange={(e)=>handleChangeInput(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="zusatzinformationen-div-main">
                  <h2>Zusatzinformationen zu Projekt</h2>
                  <p>{`Notizen zum Kunden von ${leadData?.benutzername}`}</p>
                  <textarea
                    placeholder="Notizen zum Kunden"
                    value={leadData?.notizen??""}
                     name="notizen"
                     onChange={(e)=>handleChangeInput(e)}
                  ></textarea>
                </div>
                <div className="zusatzinformationen-div-main">
                  <p >
                    Eigene Notizen zum Kunden
                    <button  style={{marginLeft:"4px"}} className={`save-bt-ui ${!ownMessage?.trim() ? 'disabled' : ''}`}  onClick={handleSchedualMeeting} disabled={!ownMessage?.trim() || leadStatus == "VERKAUFT" ||leadStatus == "STORNO"}>Speichern</button>
                  </p>
                  <textarea
                    placeholder="Notizen zum Kunden"
                    name="ownMessage"
                    value={ownMessage}
                    onChange={(e) => handleInput(e)}
                  ></textarea>
                </div>
                <div className="lead-peragraph-main">
                  <p>
                    {`Lead generiert von "${
                      leadData?.benutzername
                    }" am ${moment(leadData?.createdAt).format("DD/MM/YYYY")}`}
                  </p>
                </div>
              </div>
              {leadStatus != "offen" && (
                <div>
                  <div className="notizen-plus-div-sc">
                    <p>Terminhistorie</p>
                    {noteModel && (
                      <div className="notizen-plus-div-sc-model-background">
                        <div className="notizen-plus-div-sc-model-main">
                          <div className="notizen-plus-div-sc-model-main-icon">
                            <label>Notizen zum Termin</label>
                            <i
                              class="fa-sharp fa-solid fa-xmark"
                              aria-hidden="true"
                              onClick={() => {
                                setNoteModel(!noteModel);
                                setItShow("");
                              }}
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>
                          <textarea
                            placeholder="Notizen zum Termin..."
                            name="notes"
                            value={note?.notes}
                            onChange={(e) =>
                              itShow !== "show" && handleModelsChange(e)
                            }
                          ></textarea>

                          {itShow !== "show" && (
                            <div className="footer-button-alignment">
                              <button onClick={() => updateNotes()}>
                                {loading ? (
                                  <TailSpin
                                    color="#FFF"
                                    height={10}
                                    width={10}
                                  />
                                ) : (
                                  "Aktualisieren"
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {appoinmentData?.map((item, i) => {
                    const itemData = item?.appointmentDate;
                    const localTime = moment
                      .utc(itemData)
                      .local()
                      .format("YYYY-MM-DD HH:mm:ss");
                    const date = moment(localTime);
                    const formattedDate = date.format("DD.MM.YYYY");
                    const formattedTime = date.format("HH:mm");
                    const result = `${formattedDate} um ${formattedTime} Uhr`;
                    const isPast = date.isBefore(moment(), "minute");
                    return (
                      <div key={i} className="notizen-plus-div-sc">
                        <div className="notizen-plus-div-sc-alig">
                          <p>
                            Notizen zum Termin{" "}
                            {item?.notes ? (
                              <>
                                <i
                                  class="fa-solid fa-circle-info"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleModels(item)}
                                ></i>
                              </>
                            ) : (

                              leadStatus !== "VERKAUFT" &&
                              <svg
                                onClick={() => handleModels(item)}
                                style={{ cursor: "pointer" }}
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13 7.99609H8V12.9961C8 13.2613 7.89464 13.5157 7.70711 13.7032C7.51957 13.8907 7.26522 13.9961 7 13.9961C6.73478 13.9961 6.48043 13.8907 6.29289 13.7032C6.10536 13.5157 6 13.2613 6 12.9961V7.99609H1C0.734784 7.99609 0.48043 7.89074 0.292893 7.7032C0.105357 7.51566 0 7.26131 0 6.99609C0 6.73088 0.105357 6.47652 0.292893 6.28899C0.48043 6.10145 0.734784 5.99609 1 5.99609H6V0.996094C6 0.730877 6.10536 0.476523 6.29289 0.288987C6.48043 0.10145 6.73478 -0.00390625 7 -0.00390625C7.26522 -0.00390625 7.51957 0.10145 7.70711 0.288987C7.89464 0.476523 8 0.730877 8 0.996094V5.99609H13C13.2652 5.99609 13.5196 6.10145 13.7071 6.28899C13.8946 6.47652 14 6.73088 14 6.99609C14 7.26131 13.8946 7.51566 13.7071 7.7032C13.5196 7.89074 13.2652 7.99609 13 7.99609Z"
                                  fill="#4D4D4D"
                                />
                              </svg>
                            )}
                          </p>
                          <p>{item?.notes}</p>
                          <div className="svg-ic-align">
                            <span>{result}</span>
                            {!isPast && (
                              <svg
                                onClick={() => updateMeeting(item)}
                                style={{ cursor: "pointer" }}
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
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
                 <div  style={{display:"flex",gap:"20px"}}>
            <div className="terminieren-button-main">
              {leadStatus == "offen" || appoinmentData?.length == 0 ? (
                <button onClick={() => handleCalendar()} disabled={leadStatus == "VERKAUFT" ||leadStatus == "STORNO" }>Terminieren</button>
              ) : results?.includes(true) ? (
                <button onClick={() => handleCalendar()} disabled={leadStatus == "VERKAUFT" ||leadStatus == "STORNO" }>
                  Weiteren Termin erstellen
                </button>
              ) : (
                <button onClick={() => handleCalendar()} disabled={leadStatus == "VERKAUFT" ||leadStatus == "STORNO" }>
                  Weiteren Termin erstellen
                </button>
              )}
            </div>
            <div className="terminieren-button-main">
              <button onClick={handleUserDetails} disabled={leadStatus == "VERKAUFT" ||leadStatus == "STORNO" }>{loading ?<TailSpin color="#FFF" height={25} width={25} />:"Speichern"}</button>
            </div>
            </div>
          </div>
        </div>
      ) : (
        <CustomCalendar
          ownMessage={ownMessage}
          setModal={setModal}
          modal={modal}
          leadStatus={leadStatus == "offen" ? "TERMINIERT (1)" : leadStatus}
          leadData={leadData}
          meetingDate={meetingDate}
          appoinmentData={appoinmentData}
          type={type}
        />
      )}
    </>
  );
}
