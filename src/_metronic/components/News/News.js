import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./News.scss";
import { ApiDelete, ApiGet, ApiPut } from "../../../helpers/API/ApiData";

import { customStyles } from "../tableStyle";
import { TailSpin } from "react-loader-spinner";

import { toast } from "react-toastify";
import useDebounce from "../../../hooks/useDebounceHook";
import Moment from "react-moment";
import Swal from "sweetalert2";
import { Trash } from "react-feather";
import { Button } from "reactstrap";

export default function News() {
  const [getNewsData, setGetNewsData] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 900);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => {
        return <p>{(page - 1) * countPerPage + index + 1}</p>;
      },
      width: "60px",
    },
    {
      name: "Datum",
      width: "210px",
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
      name: "Interessent E-Mail",
      selector: (row) => <div className="profileImage">{row.email}</div>,
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
    await ApiDelete(`newsLater/deleteNewsLater?id=${row?._id}`)
      .then((res) => {
        setLoading(false);
        handleGetNewsList();
        response = true;
      })
      .catch((err) => {
        setLoading(false);
      });
    return response;
  };

  const handleConfirmDelete = (row) => {
    return Swal.fire({
      title: "Bist du sicher?",
      text: "Sind Sie sicher, dass Sie News löschen möchten??",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ja, löschen Sie es!",
      cancelButtonText: "Stornieren",
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
            text: "Newsletter erfolgreich gelöscht.",
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
    handleGetNewsList();
  }, [debouncedSearchValue, page, countPerPage]);

  const handleGetNewsList = async () => {
    setLoading(true);

    await ApiGet(
      `newsLater/getNewsLater?page=${page}${
        debouncedSearchValue ? `&search=${searchValue}` : ""
      }&limit=${countPerPage}`
    )
      .then((response) => {
        const data = response?.data?.payload.data;
        setCount(response?.data?.payload.count);

        const activeData = data.filter((jobData) => {
          return jobData.isActive;
        });
        setGetNewsData(activeData);
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
              <h2 className="pl-3 pt-2">Newsletter</h2>
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
            data={getNewsData}
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
