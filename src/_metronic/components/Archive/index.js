import React, { useEffect, useState } from "react";
import "./archive.scss";
import DataTable from "react-data-table-component";
import { ApiGet } from "../../../helpers/API/ApiData";
import { TailSpin } from "react-loader-spinner";
import { NavLink } from "react-router-dom";


const Archive = () => {
  const [loading, setLoading] = useState(false);
  const [leadData, setLeaddata] = useState([]);
  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [count, setCount] = useState(0);

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
      name: <span>Kunde</span>,
      width: "300px",
      selector: (row) => (
        <div className="profileImage">
          {row.leadId ? row?.leadId?.name + " " + row?.leadId?.nachname : "-"}
        </div>
      ),
    },
    {
      name: <span>Adresse</span>,
      width: "400px",
      selector: (row) => (
        <div className="profileImage">
          {row?.leadId
            ? row?.leadId.strabe +
              " " +
              row?.leadId?.pLZ +
              " " +
              row?.leadId?.location
            : "-"}
        </div>
      ),
    },
    
    {
      name: <span>Status</span>,
      width: "250px",
      selector: (row) => {
        const statusClass =
        ( row?.leadId?.status == "offen" || row?.leadId?.status=="NICHT ERREICHT" || row?.leadId?.status=="ZEITLICHE VERZÖGERUNG" || row?.leadId?.status=="SPÄTER ANRUFEN" )
            ? "new-deisgnpppppppppp"
           :  (row?.leadId?.status == "STORNO" ||row?.leadId?.status=="ABSAGE" )?"new-deisgn-statusooooooooooo" :"newstatusppppppppppp"
       

        return <div className={statusClass}>{ row?.leadId?.status ?row?.leadId?.status?.toUpperCase():"-"}</div>;
      },
    },
    {
      name: "",
      selector: (row) => (
        <div className="profileImage table-icon-alignment">
          <NavLink to={`/vattenlead?id=${row?.leadId?._id}`}>
            <div className="icon-svg">
              <svg
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
            </div>
          </NavLink>
        </div>
      ),
    },
  ];

  const customNoDataComponent = () => (
    <div style={{ textAlign: "center", padding: "10px 0px", fontSize: "16px" }}>
      Aktuell sind keine Daten vorhanden.
    </div>
  );
  const getConfirmLeaddata = async () => {
    try {
      setLoading(true);
      let response = await ApiGet(
        `vattenfall/getLeadStatus?page=${page}&limit=${countPerPage}`
      );
      setLeaddata(response?.data?.payload?.findConform);
      setCount(response?.data?.payload?.count);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getConfirmLeaddata();
  }, []);

  return (
    <>
      <div className="archivepage-container">
        <div className="archivepage-title">
          <p> ABGESCHLOSSENE PROJEKTE</p>
          <span></span>
        </div>
      </div>

      <div className="projekte-datatable-ss">
        <DataTable
          columns={columns}
          data={leadData}
          responsive
          noDataComponent={customNoDataComponent()}
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
    </>
  );
};

export default Archive;
