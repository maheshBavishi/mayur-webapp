import React, { useEffect, useRef, useState } from "react";
import "moment-timezone";
import {
  ApiGet,
  ApiGetNoAuth,
  ApiPost,
  ApiPut,
} from "../../../helpers/API/ApiData";
import "../Team/tema.scss";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

import { useLocation } from "react-router-dom";
import { getUserInfo } from "../../../utils/user.util";

export default function AddNewLead() {
  const [leadData, setLeadData] = useState({});
  const [erros, setErrors] = useState();
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

  const history = useHistory();
  const url = window.location.href;
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");
  const location = useLocation();

  //   const getDataById = async () => {
  //     try {
  //       let response = await ApiGet(`vattenfall/getLead?id=${id}`);
  //       setOwnMessage(response?.data?.payload?.leadNotes);
  //       setLeadData(response?.data?.payload);
  //       setLeadStatus(response?.data?.payload?.status);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     leadData && getDataById();
  //   }, []);

  //   const handleInput = (e) => {
  //     setOwnMessage(e.target.value);
  //   };

  //   const handleCalendar = () => {
  //     setModal(!modal);
  //   };

  //   const handleStatus = async (statuss) => {
  //     setToggle(!toggle);
  //     setLeadStatus(statuss);

  //     try {
  //       let body = {
  //         status: statuss,
  //       };
  //       let resp = await ApiPut(
  //         `vattenfall/updateLeadVatten${id ? `?id=${id}` : ""}`,
  //         body
  //       );
  //       toast.success("Status erfolgreich verändert.");
  //       console.log(
  //         " window.location.href = '/new-path';",
  //         resp?.data?.payload?.status == "VERKAUFT"
  //       );
  //       if (resp?.data?.payload?.status == "VERKAUFT") {
  //         window.location.href = "/archive";
  //       }
  //     } catch (error) {
  //       toast.error("Failed to update lead status");
  //       console.log(error);
  //     }
  //   };

  //   const getAppointment = async () => {
  //     try {
  //       let response = await ApiGet(`vattenfall/getAppointment?leadId=${id}`);
  //       setAppoinmentData(response?.data?.payload);
  //       setNote(response?.data?.payload);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

//   useEffect(() => {
//     getAppointment();
//   }, []);

//   const today = new Date();
//   const results =
//     appoinmentData &&
//     appoinmentData?.map((appointment) => {
//       return new Date(appointment.appointmentDate) > today;
//     });

  //   const updateMeeting = (item) => {
  //     setMeetingDate(item);
  //     setModal(!modal);
  //     setType("update");
  //   };

  //   const status =
  //     leadStatus !== "offen"
  //       ? [
  //           "AUFMAß",
  //           "offen",
  //           "ZEITLICHE VERZÖGERUNG",
  //           "ANGEBOTSBESPRECHUNG",
  //           "ANGEBOTSBESPRECHUNG 2",
  //           "ABSAGE",
  //           "VERKAUFT",
  //         ]
  //       : ["ZEITLICHE VERZÖGERUNG", "STORNO", "NICHT ERREICHT"];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setLeadData({ ...leadData, [name]: value });
  };
  let userInfo = getUserInfo();
  const handleUserDetails = async () => {
    if (validation()) {
      try {
        setLoading(true);
        let body = {
          name: leadData?.name,
          nachname: leadData?.nachname,
          telephon: leadData?.telephon,
          email: leadData?.email ? leadData?.email : "",
          strabe: leadData?.strabe ? leadData?.strabe : "",
          pLZ: leadData?.pLZ ? leadData?.pLZ : "",
          location: leadData?.location ? leadData?.location : "",
          housetype: leadData?.housetype ? leadData?.housetype : "",
          satteldach: leadData?.satteldach ? leadData?.satteldach : "",
          power_consumption: leadData?.power_consumption
            ? leadData?.power_consumption
            : "",
          roofFelt: leadData?.roofFelt ? leadData?.roofFelt : "",
          "schornstein[0]": leadData?.schornstein
            ? [leadData?.schornstein]
            : "",
          aktuellkeinEAuto: leadData?.aktuellkeinEAuto
            ? leadData?.aktuellkeinEAuto
            : "",
          rooftype: leadData?.rooftype ? leadData?.rooftype : "",
          notizen: leadData?.notizen ? leadData?.notizen : "",
          accessibility: leadData?.accessibility ? leadData?.accessibility : "",
          benutzername: userInfo?.name,
          "funnel_type":"vattenfall"
        };
        let resp = await ApiPost(`vattenfall/createLead`, body);

        history.push("/newlead");
        toast.success("Leaddaten aktualisiert");
        setLeadData("");
      } catch (error) {
        toast.error("Failed update data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const validation = () => {
    let isVlid = true;
    let errors = {};
    if (leadData?.name.trim() == "") {
      errors["name"] = "Bitte überprüfe deine Eingabe";
      isVlid = false;
    }
    if (leadData?.name.trim() == "") {
      errors["nachname"] = "Bitte überprüfe deine Eingabe";
      isVlid = false;
    }
    if (leadData?.name.trim() == "") {
      errors["telephon"] = "Bitte überprüfe deine Eingabe";
      isVlid = false;
    }
    setErrors(errors);
    return isVlid;
  };

  return (
    <>
      <div className="VattelnFallLead-main">
        <div className="VattelnFallLead-container">
          <div className="VattelnFallLead-title">
            <p>
              {`Terminierung "${leadData?.name || "Vorname"} ${
                leadData?.nachname || "Nachname"
              }" in "${leadData?.location || "Ort"}" errreichbar unter:
                "${leadData?.telephon || "Telefon"}"`}
            </p>
          </div>
          {/* <div
           
            onClick={() => setToggle(!toggle)}
            className={
              leadStatus == "STORNO" || leadStatus == "ABSAGE"
                ? "offen-ticket-div"
                : leadStatus == "VERKAUFT"
                ? "offen-ticket-div-status-col-2"
                : "offen-ticket-div-status-col"
            }
          >
            <span
              className={
                leadStatus == "STORNO" || leadStatus == "ABSAGE"
                  ? "status-color"
                  : leadStatus == "VERKAUFT"
                  ? "final-status-green"
                  : "status-color-new"
              }
            >
              {leadStatus?.toUpperCase()}
            </span>
            <div
              className={
                leadStatus == "STORNO" ||
                leadStatus == "VERKAUFT" ||
                leadStatus == "ABSAGE"
                  ? "display-no"
                  : "display-yes"
              }
            >
              {" "}
              
            </div>
            
          </div> */}
          <div className="VattelnFallLead-main-content">
            <div className="VattelnFallLead-main-content-one">
              <div>
                <label>
                  Vorname <span>{erros?.name}</span>
                </label>
                <input
                  type="text"
                  placeholder="Vorname"
                  name="name"
                  value={leadData?.name}
                  onChange={(e) => handleChangeInput(e)}
                />
              </div>
              <div>
                <label>
                  Nachname <span>{erros?.nachname}</span>
                </label>
                <input
                  type="text"
                  placeholder="Nachname"
                  name="nachname"
                  value={leadData?.nachname}
                  onChange={(e) => handleChangeInput(e)}
                />
              </div>
              <div>
                <label>
                  Telefon <span>{erros?.telephon}</span>
                </label>
                <input
                  type="text"
                  placeholder="Telefon"
                  name="telephon"
                  value={leadData?.telephon}
                  onChange={(e) => handleChangeInput(e)}
                />
              </div>
              <div className="email-input-mobile">
                <label>E-Mail</label>
                <input
                  type="text"
                  placeholder="E-Mail"
                  name="email"
                  onChange={(e) => handleChangeInput(e)}
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
                  onChange={(e) => handleChangeInput(e)}
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
                    onChange={(e) => handleChangeInput(e)}
                    value={leadData?.pLZ}
                  />
                </div>
                <div>
                  <label>Ort</label>
                  <input
                    type="text"
                    placeholder="Ort"
                    name="location"
                    onChange={(e) => handleChangeInput(e)}
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
                  onChange={(e) => handleChangeInput(e)}
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
                    onChange={(e) => handleChangeInput(e)}
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
                    onChange={(e) => handleChangeInput(e)}
                  />
                </div>
              </div>
              <div>
                <label>Stromverbrauch</label>
                <input
                  type="text"
                  placeholder="Stromverbrauch"
                  name="power_consumption"
                  onChange={(e) => handleChangeInput(e)}
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
                    onChange={(e) => handleChangeInput(e)}
                    value={leadData?.roofFelt}
                  />
                </div>
                <div>
                  <label>Störfaktoren</label>
                  <input
                    type="text"
                    placeholder="Störfaktoren"
                    name="schornstein"
                    onChange={(e) => handleChangeInput(e)}
                    value={leadData?.schornstein}
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
                      onChange={(e) => handleChangeInput(e)}
                    />
                  </div>
                  <div className="ort-input">
                    <label>Wärmepumpe</label>
                    <input
                      type="text"
                      placeholder="Wärmepumpe"
                      name="rooftype"
                      onChange={(e) => handleChangeInput(e)}
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
                      onChange={(e) => handleChangeInput(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="zusatzinformationen-div-main">
                <h2>Zusatzinformationen zu Projekt</h2>
                <p>{`Notizen zum Kunden von`}</p>
                <textarea
                  placeholder="Notizen zum Kunden"
                  value={leadData?.notizen??""}
                  name="notizen"
                  onChange={(e) => handleChangeInput(e)}
                ></textarea>
              </div>
              {/* <div className="zusatzinformationen-div-main">
                <p>
                  Eigene Notizen zum Kunden
                  <button
                    style={{ marginLeft: "4px" }}
                    className={`save-bt-ui ${
                      !ownMessage?.trim() ? "disabled" : ""
                    }`}
                    onClick={handleSchedualMeeting}
                    disabled={
                      !ownMessage?.trim() ||
                      leadStatus == "VERKAUFT" ||
                      leadStatus == "STORNO"
                    }
                  >
                    Speichern
                  </button>
                </p>
                <textarea
                  placeholder="Notizen zum Kunden"
                  name="ownMessage"
                  value={ownMessage}
                  onChange={(e) => handleInput(e)}
                ></textarea>
              </div> */}
              {/* <div className="lead-peragraph-main">
                  <p>
                    {`Lead generiert von "${
                      leadData?.benutzername
                    }" am ${moment(leadData?.createdAt).format("DD/MM/YYYY")}`}
                  </p>
                </div> */}
            </div>
            {/* {leadStatus != "offen" && (
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
              )} */}
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {/* <div className="terminieren-button-main">
              {leadStatus == "offen" || appoinmentData?.length == 0 ? (
                <button
                  onClick={() => handleCalendar()}
                  disabled={leadStatus == "VERKAUFT" || leadStatus == "STORNO"}
                >
                  Terminieren
                </button>
              ) : results?.includes(true) ? (
                <button
                  onClick={() => handleCalendar()}
                  disabled={leadStatus == "VERKAUFT" || leadStatus == "STORNO"}
                >
                  Weiteren Termin erstellen
                </button>
              ) : (
                <button
                  onClick={() => handleCalendar()}
                  disabled={leadStatus == "VERKAUFT" || leadStatus == "STORNO"}
                >
                  Weiteren Termin erstellen
                </button>
              )}
            </div> */}
            <div className="terminieren-button-main">
              <button
                onClick={handleUserDetails}
                // disabled={leadStatus == "VERKAUFT" || leadStatus == "STORNO"}
              >
                {loading ? (
                  <TailSpin color="#FFF" height={25} width={25} />
                ) : (
                  "Speichern"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      )
    </>
  );
}
