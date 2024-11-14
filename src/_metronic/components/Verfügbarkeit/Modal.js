import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ApiPost } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import { generateDateRange } from "./Functions";

const ConfirmationModal = ({ modal, toggle, handleClear, formattedDate, handleGetDates, isAvailableTravel, isAvailable }) => {
  const [picked, setPicked] = useState("");

  const handleRadioChange = (e) => {
    setPicked(e.target.value);
  };

  useEffect(() => {
    if (modal) {
      setPicked("");
    }
  }, [modal]);

  const handleSubmit = () => {
    const previousDateRanges = [...isAvailable, ...isAvailableTravel];
    const allRanges = previousDateRanges.map((range) => generateDateRange(range[0], range[1])).flat();
    const date = generateDateRange(formattedDate[formattedDate.length - 1][0], formattedDate[formattedDate.length - 1][1]);
    const payloadValues = {
      [picked]: true,
      // date: date.filter((date) => !allRanges.includes(date)),
      date
    };

    ApiPost(`/dateSelect/addSelectDate`, payloadValues)
      .then((res) => {
        if (res?.data?.success) {
          // handleGetDates();
          toast.success("Verfügbarkeit erfolgreich hinzugefügt");
          toggle();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Modal centered size="sm" show={modal} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Verfügbarkeit</Modal.Title>
      </Modal.Header>
      <Modal.Body className="confirmation-modal">
        <div className="radio-group">
          <label className={picked === "isAvailable" ? "selected-available" : ""}>
            <input type="radio" name="picked" value="isAvailable" onChange={handleRadioChange} />
            <span className="custom-radio"></span>
            Verfügbar
          </label>
          <label className={picked === "isAvailableTravel" ? "selected-travel" : ""}>
            <input type="radio" name="picked" value="isAvailableTravel" onChange={handleRadioChange} />
            <span className="custom-radio"></span>
            Verfügbar und reisebereit
          </label>
          <label className={picked === "isNotAvailable" ? "selected-not-available" : ""}>
            <input type="radio" name="picked" value="isNotAvailable" onChange={handleRadioChange} />
            <span className="custom-radio"></span>
            Nicht verfügbar
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => {
              toggle();
              handleClear();
            }}
          >
            Abbrechen
          </button>
          <button className="btn btn-success submit-btn" type="submit" disabled={!picked} onClick={handleSubmit}>
          Speichern
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
