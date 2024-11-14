import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Moment from "react-moment";
import { ApiGet, ApiPut, ApiDelete } from "../../../helpers/API/ApiData";
import { Button } from "reactstrap";
import { customStyles } from "../tableStyle";
import { TailSpin } from "react-loader-spinner";

import { toast } from "react-toastify";
import useDebounce from "../../../hooks/useDebounceHook";
import Swal from "sweetalert2";
import { Trash } from "react-feather";

export default function Kontaktdetails() {
  const [getKontaktData, setgetKontaktData] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 900);

  const columns = [
    {
      name: "SNo",
      cell: (row, index) => {
        return <p>{(page - 1) * countPerPage + index + 1}</p>;
      },
      width: "60px",
    },
    {
      name: "Created Datum",
      minWidth: "150px",
      selector: (row) => (
        <div className="profileImage">
          {row.createdAt ? (
            <Moment format="DD-MM-YYYY" date={row.createdAt} />
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      name: "Postleitzahl",
      minWidth: "150px",
      selector: (row) => (
        <div className="profileImage">{row.region ? row.region : "-"}</div>
      ),
    },
    {
      name: "Menge",
      selector: (row) => (
        <div className="profileImage">{row.crowd ? row.crowd : "-"}</div>
      ),
    },
    {
      name: "Contact Category",
      minWidth: "200px",
      selector: (row) => (
        <div className="profileImage">
          {row.inquiryCategory ? row.inquiryCategory : "-"}
        </div>
      ),
    },

    {
      name: "Datum",
      minWidth: "150px",
      selector: (row) => (
        <div className="profileImage">
          {row.date ? <Moment format="DD-MM-YYYY" date={row.date} /> : "-"}
        </div>
      ),
    },
    {
      name: "E-mail",
      width: "300px",
      selector: (row) => <div>{row.email ? row.email : "-"}</div>,
    },
    {
      name: "Telefon",
      minWidth: "150px",
      selector: (row) => (
        <div className="profileImage">
          {row.telephone ? row.telephone : "-"}
        </div>
      ),
    },
    {
      name: "Ansprechpartner",
      width: "300px",
      selector: (row) => (
        <div className="profileImage">
          {row.contact_person ? row.contact_person : "-"}
        </div>
      ),
    },
    {
      name: "Firmenname",
      width: "300px",
      selector: (row) => (
        <div className="profileImage">
          {row.company_name ? row.company_name : "-"}
        </div>
      ),
    },
    {
      name: "Löschen",
      selector: (row) => (
        <div className="actionColumn">
          <Button
            size="sm"
            color="transparent"
            className="btn btn-icon"
            onClick={() => {
              handleConfirmDelete(row);
            }}
          >
            <Trash className="font-medium-2" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteNewsInfo = async (row) => {
    setLoading(true);
    let response = false;
    await ApiDelete(`inquiry/deleteInquiry?id=${row?._id}`)
      .then((res) => {
        // toast.success("News deleted successfully");
        setLoading(false);
        handleGetKontaktDetails();
        response = true;
      })
      .catch((err) => {
        setLoading(false);
        // toast.error("Oop's something wrong happened");
      });
    return response;
  };

  const handleConfirmDelete = (row) => {
    return Swal.fire({
      title: "Bist du sicher?",
      text: "Sind Sie sicher, dass Sie den Kontakt löschen möchten?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ja, löschen Sie es!",
      cancelButtonText :"Stornieren",
      customClass: {
        confirmButton: "btn btn-primary mr-10",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(async function (result) {
      if (result.value) {
        const res = await handleDeleteNewsInfo(row);
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Gelöscht!",
            text: "Kontakt wurde gelöscht.",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          Swal.fire({
            title: "Abgesagt",
            text: "Löschung abgebrochen!!",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Abgesagt",
          text: "Löschung abgebrochen!!",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };
  useEffect(() => {
    handleGetKontaktDetails();
  }, [debouncedSearchValue, countPerPage, page]);

  const handleGetKontaktDetails = async () => {
    setLoading(true);

    await ApiGet(
      `inquiry/getInquiry?page=${page}${
        debouncedSearchValue ? `&search=${searchValue}` : ""
      }&limit=${countPerPage}`
    )
      .then((response) => {
        const data = response?.data?.payload.data;
        setCount(response?.data?.payload.count);

        const activeData = data.filter((jobData) => {
          return jobData.isActive;
        });
        setgetKontaktData(activeData);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="card p-1">
        <div className="p-2 mb-2">
          <div className="row mb-4 pr-3">
            <div className="col-12 col-lg-4 d-flex align-items-center">
              <h2 className="pl-3 pt-2">Kontakt</h2>
            </div>
            <div className="col-lg-8 justify-content-end align-items-center row">
              <div className="col col-lg-5">
                <div>
                  <input
                    type="search"
                    className={`form-control form-control-lg form-control-solid `}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setLoading(true);
                    }}
                    name="search"
                    value={searchValue}
                    placeholder="Suche"
                  />
                </div>
              </div>
            </div>
          </div>
          <DataTable
            data={getKontaktData}
            columns={columns}
            responsive
            customStyles={customStyles}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={count}
            className="new_data__table table_height"
            paginationPerPage={countPerPage}
            paginationRowsPerPageOptions={[5, 10, 20, 25, 50]}
            paginationDefaultPage={page}
            progressPending={loading}
            progressComponent={
              <TailSpin color="#334D52" height={30} width={30} />
            }
            onChangePage={(page) => {
              setPage(page);
            }}
            onChangeRowsPerPage={(rowPerPage) => {
              setCountPerPage(rowPerPage);
            }}
            fixedHeader
          />
        </div>
      </div>
    </div>
  );
}
