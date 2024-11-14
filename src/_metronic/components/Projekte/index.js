import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "moment-timezone";
import Moment from "react-moment";
import { TailSpin } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import "./preojekte.scss";
import { ApiGet, ApiGetNoAuth, ApiPut } from "../../../helpers/API/ApiData";
import useDebounce from "../../../hooks/useDebounceHook";
import { toast } from "react-toastify";

import Moreicon from "../../../assets/icon/more.png";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import moment from "moment/moment";
import CustomCalendar from "../Calendar/calender";

export default function Projekte() {
  const [tickets, setTickets] = useState([]);
  const [modal, setModal] = useState(false);
  const [leadData, setLeadData] = useState();
  const [id, setId] = useState();
  const [search,setSearch]=useState()

const debouncValue=useDebounce(search,400)

  const ALL_STATUS = [
    { id: "11", status: "offen" },
    { id: "21", status: "TERMINIERT" },
    { id: "12", status: "ZEITLICHE VERZÖGERUNG" },
    { id: "12", status: "SPÄTER ANRUFEN" },
    { id: "13", status: "AUFMAß" },
    { id: "14", status: "ANGEBOTSBESPRECHUNG" },
    { id: "15", status: "ANGEBOTSBESPRECHUNG 2" },
    { id: "16", status: "ABSAGE" },
    { id: "17", status: "VERKAUFT" },
    { id: "19", status: "STORNO" },
    { id: "20", status: "NICHT ERREICHT" },
  ];

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const id = url.searchParams.get("id");
    setId(id);
  }, [window.location.href]);

  const getStatusWiseData = async () => {
    try {
      if (id) {
        const response = await ApiGet(
          `vattenfall/getIdUserConformLead?id=${id}`
        );
        setTickets(response?.data?.payload?.findConform);
        console.log("response", response?.data?.payload?.findConform);
      } else {
        const response = await ApiGet(`vattenfall/getConformLead${debouncValue?`?search=${debouncValue}`:""}`);
        setTickets(response?.data?.payload?.findConform);
      }
    } catch (error) {
      toast.error("error", error.message);
    }
  };

  console.log(tickets, "setsdsssssss");

  useEffect(() => {
    getStatusWiseData();
  }, [id,debouncValue]);

  const getTicketsPerStatus = useCallback(
    (newStatus) => {
      const data = tickets.filter((ticket) => ticket._id === newStatus);
      return data?.[0]?.data;
    },
    [tickets, id]
  );

  const totalLengthTicket =
    tickets && tickets.reduce((sum, item) => sum + item?.data?.length, 0);

  const updateStatus = async (source, destination) => {
    try {
      let body = {
        status: destination?.droppableId,
      };
      let resp = await ApiPut(
        `vattenfall/updateLeadVatten?id=${source?.index}`,
        body
      );
      toast.success("status updated");
      getStatusWiseData();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const TicketItem = React.memo(({ item, index }) => (
    <Draggable
      draggableId={item?.leadId._id}
      index={item?.leadId._id}
      key={index}
    >
      {(provided) => (
        <div
          className="projeckt-ticket-main-body-box"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="projeckt-ticket-main-body-box-header">
            <div className="projeckt-ticket-main-body-box-header-left-eye">
              <div className="projeckt-ticket-main-body-box-header-left-eye-circle">
                <svg
                  focusable="false"
                  aria-label="Open issue"
                  className="Octicon-sc-9kayk9-0 cRyBKI"
                  role="img"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                </svg>
              </div>
              <span>benutzername: {item?.leadId?.benutzername}</span>
            </div>
          </div>

          <div className="projeckt-ticket-main-body-box-links"> </div>
          <div style={{ color: "#000" }}>
            Kunde: {item?.leadId?.name + " " + item?.leadId?.nachname}
          </div>
          <div className="projeckt-ticket-main-body-box-links-button">
            <a href="/">
              <button type="button">
                {item?.leadId?.status.toLocaleUpperCase()}
              </button>
            </a>
          </div>
          <div className="projeckt-ticket-main-body-box-links-ticket-button">
            <a href="/">
              <button type="button">
                {item?.leadId?.strabe || "-"} {item?.leadId?.pLZ || "-"}{" "}
                {item?.leadId?.location || "-"}
              </button>
            </a>
            <a href="/">
              <button type="button">
                {moment(item?.leadId?.createdAt).format("MMM D, YYYY")}
              </button>
            </a>
          </div>
        </div>
      )}
    </Draggable>
  ));

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    const newTickets = [...tickets];

    const columnArray = newTickets.find(
      (item) => item?._id === source.droppableId
    )?.data;

    const draggedTicket = columnArray?.find(
      (item) => item.leadId._id === source.index
    );

    if (!destination || destination.droppableId === source.droppableId) return;

    if (
      source.droppableId?.startsWith("TERMINIERT") &&
      destination.droppableId == "offen"
    )
      return;

    if (source.droppableId == "offen") {
      setModal(!modal);
      setLeadData(draggedTicket?.leadId);
      return null;
    }

    const addTicketToColumn = () => {
      const isColumnExist = newTickets?.find(
        (item) => item?._id === destination.droppableId
      );

      const updatedTickets = newTickets?.map((item) => {
        if (isColumnExist && item._id === destination.droppableId) {
          return {
            ...item,
            data: [...item.data, draggedTicket],
          };
        }

        if (item._id === source.droppableId) {
          const updatedData = item.data.filter(
            (ticket) => ticket._id !== draggedTicket._id
          );
          return {
            ...item,
            data: updatedData,
          };
        }

        return item;
      });

      if (!isColumnExist) {
        const newColumn = {
          _id: destination.droppableId,
          data: [draggedTicket],
        };
        updatedTickets.push(newColumn);
      }
      setTickets(updatedTickets);
    };
    addTicketToColumn();
    await updateStatus(source, destination);
  };
  return (
    <>
      <div className="search-trello-input">
        <input type="text" name="search" onChange={(e)=>setSearch(e.target.value)} placeholder="Suche" />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="projekte-container">
          <div className="projekct-ticket-main-layout">
            <div className="projekct-ticket-main">
              {ALL_STATUS.map((status, id) => (
                <Droppable droppableId={status.status} key={id} index={id}>
                  {(provided) => (
                    <div
                      className="projeckt-ticket-box"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="projeckt-ticket-head">
                        <div className="projeckt-card-header-left-eye-content">
                          <div className="projeckt-header-circle"></div>
                          <p>{status.status?.toLocaleUpperCase()}</p>
                          <div className="projeckt-header-numericks">
                            <span>
                              {getTicketsPerStatus(status.status)?.length || 0}{" "}
                              / {totalLengthTicket}
                            </span>
                          </div>
                        </div>
                        <div className="projeckt-ticket-menu-icon">
                          <img src={Moreicon} alt="Moreicon" />
                        </div>
                      </div>
                      <div className="this-title-header"></div>
                      <div className="projeckt-ticket-main-body">
                        {getTicketsPerStatus(status.status)?.map(
                          (item, idx) => (
                            <NavLink to={`/vattenlead?id=${item?.leadId._id}`}>
                              <TicketItem item={item} index={idx} key={idx} />
                            </NavLink>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      {modal && (
        <>
          <div className="model-design-meeting">
            <div className="model-design-content">
              <div className="close-icon" onClick={() => setModal(!modal)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                    fill="#000"
                  />
                </svg>
              </div>
              <CustomCalendar
                ownMessage={""}
                setModal={setModal}
                modal={modal}
                leadStatus={"offen"}
                leadData={leadData}
                meetingDate={null}
                appoinmentData={[]}
                type={"add"}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
