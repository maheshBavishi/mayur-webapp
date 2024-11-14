import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "moment-timezone";
import Moment from "react-moment";
import "../Team/tema.scss";
import { TailSpin } from "react-loader-spinner";
import { ApiGet } from "../../../helpers/API/ApiData";
import { customStyles } from "../tableStyle";

export default function VattenfallTeam() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [teamData, setTeamData] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [status, setstatus] = useState();
  const [statusValue, setstatusValue] = useState();
  const [user, setUser] = useState();
  const [userDetails, setuserDetails] = useState();

  useEffect(() => {
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(endDate.getDate() - 7);

    setStartDate(oneWeekAgo);
  }, []);

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const columns = [
    {
      name: <span>No</span>,
      cell: (row, index) => {
        return <p>{index + 1}</p>;
      },
      width: "60px",
    },
    {
      name: <span>Datum & Uhrzeit</span>,
      width: "400px",
      selector: (row) => (
        <div className="profileImage">
          {row.createdAt ? (
            <Moment format="DD.MM.YY HH:mm" tz="CET" date={row.createdAt} />
          ) : (
            "-"
          )}
        </div>
      ),
    },

    {
      name: <span>Teammitglied</span>,
      width: "400px",
      selector: (row) => (
        <div className="profileImage">
          {row.benutzername ? row.benutzername : "-"}
        </div>
      ),
    },

    { 
      name: <span>Status</span>,
      width: "250px",
      selector: (row) => {
        const statusClass =
         ( row?.status == "offen" || row?.status=="NICHT ERREICHT" || row?.status=="ZEITLICHE VERZÖGERUNG" ||row?.status=="SPÄTER ANRUFEN")
            ? "new-deisgnpppppppppp"
           :(  row?.status == "STORNO"  ||  row?.status=="ABSAGE") ?"new-deisgn-statusooooooooooo" : (row?.status=="VERKAUFT" ||  row?.status=="AUFMAß" || row?.status=="ANGEBOTSBESPRECHUNG" || row?.status=="ANGEBOTSBESPRECHUNG 2" ||row?.status?.replace(/\s*\(.*?\)\s*/g, "")=="TERMINIERT" )?"newstatusppppppppppp":""
       

        return <div className={statusClass}>{ ( row?.status == "offen" || row?.status=="NICHT ERREICHT" || row?.status=="ZEITLICHE VERZÖGERUNG" ||row?.status=="SPÄTER ANRUFEN")?"OFFEN":(row?.status=="STORNO" ||  row?.status=="ABSAGE"  )?"Abgelehnt": (row?.status=="VERKAUFT" ||  row?.status=="AUFMAß" || row?.status=="ANGEBOTSBESPRECHUNG" || row?.status=="ANGEBOTSBESPRECHUNG 2" ||row?.status?.replace(/\s*\(.*?\)\s*/g, "")=="TERMINIERT" )? "bestätigt":"-"}</div>;
      },
    },
    // {
    //   name: <span>Status</span>,y

    //   width: "250px",
    //   selector: (row) => {
    //     const statusClass =
    //      ( row?.status == "offen" || row?.status=="NICHT ERREICHT")
    //         ? "new-deisgn"
    //        :row?.status == "VERKAUFT"?"newly-dddds": row?.status==null?"": "new-deisgn-status"
       

    //     return <div className={statusClass}>{ row.status ?row?.status?.toUpperCase():"-"}</div>;
    //   },
    // },
  ];

  const Mobilecolumns = [
    {
      name: <span>No</span>,
      cell: (row, index) => {
        return <p>{index + 1}</p>;
      },
      width: "60px",
    },
    {
      name: <span>Datum & Uhrzeit</span>,
      width: "150px",
      selector: (row) => (
        <div className="profileImage">
          {row.createdAt ? (
            <Moment format="DD.MM.YY HH:mm" tz="CET" date={row.createdAt} />
          ) : (
            "-"
          )}
        </div>
      ),
    },

    {
      name: <span>Teammitglied</span>,
      width: "200px",
      selector: (row) => (
        <div className="profileImage">
          {row.benutzername ? row.benutzername : "-"}
        </div>
      ),
    },
    { 
      name: <span>Status</span>,
      width: "250px",
      selector: (row) => {
        const statusClass =
         ( row?.status == "offen" || row?.status=="NICHT ERREICHT" || row?.status=="ZEITLICHE VERZÖGERUNG" ||row?.status=="SPÄTER ANRUFEN")
            ? "new-deisgnpppppppppp"
           :(  row?.status == "STORNO"  ||  row?.status=="ABSAGE") ?"new-deisgn-statusooooooooooo" : (row?.status=="VERKAUFT" ||  row?.status=="AUFMAß" || row?.status=="ANGEBOTSBESPRECHUNG" || row?.status=="ANGEBOTSBESPRECHUNG 2" ||row?.status?.replace(/\s*\(.*?\)\s*/g, "")=="TERMINIERT" )?"newstatusppppppppppp":""
       

        return <div className={statusClass}>{ ( row?.status == "offen" || row?.status=="NICHT ERREICHT" || row?.status=="ZEITLICHE VERZÖGERUNG" ||row?.status=="SPÄTER ANRUFEN")?"OFFEN":(row?.status=="STORNO" ||  row?.status=="ABSAGE"  )?"Abgelehnt": (row?.status=="VERKAUFT" ||  row?.status=="AUFMAß" || row?.status=="ANGEBOTSBESPRECHUNG" || row?.status=="ANGEBOTSBESPRECHUNG 2" ||row?.status?.replace(/\s*\(.*?\)\s*/g, "")=="TERMINIERT" )? "bestätigt":"-"}</div>;
      },
    },
     
  ];

  let userData = user?.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));
  const handleChangeCommom = (data, type) => {
    // if (type == "status") {
    //   setstatusValue(data);
    // }
    if (type == "user") {
      setuserDetails(data);
    }
  };

  const customNoDataComponent = () => (
    <div style={{ textAlign: "center", padding: "10px 0px", fontSize: "16px" }}>
      Aktuell sind keine Daten vorhanden.
    </div>
  );

  const getTeamData = async () => {
    try {
      setLoading(true);
      let resp = await ApiGet(
        `straper/getTeamVattenReport?page=${page}&limit=${countPerPage}${
          userDetails ? `&userId=${userDetails?.value}` : ""
        }${
          startDate ? `&startDate=${startDate.toISOString().split("T")[0]}` : ""
        }${endDate ? `&endDate=${endDate.toISOString().split("T")[0]}` : ""}`
      );
      setTeamData(resp?.data?.payload?.findStraper);
      //   setstatus(resp?.data?.payload?.allStatus);
      setUser(resp?.data?.payload?.data);
      setCount(resp?.data?.payload?.count);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    startDate && endDate && getTeamData();
  }, [statusValue, page, countPerPage, userDetails, startDate, endDate]);

  return (
    <>
      <div className="card p-1">
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3 header-alignment">
            <div className=" col-lg-4 d-flex align-items-center gap-20">
              <h2 className="pl-3 pt-2 mr-5">Leads</h2>
              <div>{/* <DateFilter onApply={handleApply} /> */}</div>
            </div>

            <div className="row filter-alignment">
              <div className="date-picker">
                <DatePicker
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date"
                  onChange={handleOnChange}
                  maxDate={new Date()}
                  onKeyDown={(e) => e.preventDefault()}
                  selectsRange
                  className="custom-date"
                />
              </div>

              <div className="project-Dropdown-pp">
                <Select
                  className="dropdown-align "
                  value={userDetails}
                  name="userName"
                  onChange={(e) => {
                    handleChangeCommom(e, "user");
                  }}
                  placeholder="Teammitglied"
                  options={userData}
                  isClearable={true}
                />
              </div>
              {/* <div className="statusOptions">
                <Select
                  value={statusValue}
                  name="status"
                  onChange={(e) => handleChangeCommom(e, "status")}
                  options={statusOptions}
                  placeholder="Status "
                  isClearable={true}
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="webtable">
          <DataTable
            columns={columns}
            data={teamData}
            responsive
            noDataComponent={customNoDataComponent()}
            customStyles={customStyles}
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
        <div className="mobileTable">
          <DataTable
            columns={Mobilecolumns}
            data={teamData}
            responsive
            noDataComponent={customNoDataComponent()}
            customStyles={customStyles}
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
      </div>
    </>
  );
}
