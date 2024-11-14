import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "moment-timezone";
import Moment from "react-moment";
import "./neueleads.scss";
import { TailSpin } from "react-loader-spinner";
import { ApiGet, ApiPut, ApiPutNoAuth } from "../../../helpers/API/ApiData";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function NeueLeads() {
  const [leadData, setLeadData] = useState();
  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLeadData = async () => {
    setLoading(true);
    try {
      let response = await ApiGet(
        `vattenfall/getNewLead?page=${page}&limit=${countPerPage}`
      );
      setCount(response?.data?.payload?.count)
      setLeadData(response?.data?.payload?.findNewLead);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLeadData();
  }, [page,countPerPage]);

  const handleLead = async (item, leadStatus) => {
    try {
      let body = {
        status: leadStatus,
      };
      let response = await ApiPut(
        `vattenfall/updateNewLead?id=${item?._id}`,
        body
      );
      getLeadData();
      toast.success(leadStatus == "conform" ? "Bestätigen" : "Ablehnen");
    } catch (error) {
      console.log(error);
    }
  };

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
      name: <span>Datum & Uhrzeit</span>,
      width: "400px",
      selector: (row) => (
        <div className="profileImage">
          {row.leadId?.createdAt ? (
            <Moment format="DD.MM.YY HH:mm" tz="CET" date={row?.createdAt} />
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      name: <span>PLZ</span>,
      width: "100px",
      selector: (row) => (
        <div className="profileImage">
          {row.leadId?.pLZ ? row.leadId?.pLZ : "-"}
        </div>
      ),
    },
    {
      name: <span>Lead generiert durch</span>,
      selector: (row) => (
        <div className="profileImage">
          {row.leadId?.benutzername ? row.leadId?.benutzername : "-"}
        </div>
      ),
    },
    {
      name: "",
      selector: (row) => (
        <div className="profileImage table-buttonalignment">
          <button onClick={() => handleLead(row, "conform")}>
            Terminieren
          </button>
        </div>
      ),
    },
  ];

  const customNoDataComponent = () => (
    <div style={{ textAlign: "center", padding: "10px 0px", fontSize: "16px" }}>
      Aktuell sind keine Leads verfügbar.
    </div>
  );

  return (
    <>
      <div className="neueleads-container">
        <div className="neulead-title">
          <p>LEAD TAFEL</p>
          <span></span>
        </div>

        <div className="newleads-datatable">
          <DataTable
            columns={columns}
            data={leadData}
            responsive
            noDataComponent={customNoDataComponent()}
            // customStyles={customStyles}
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
