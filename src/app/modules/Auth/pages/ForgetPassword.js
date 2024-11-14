import React, { useState } from "react"; //
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Input, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { ApiPost } from "../../../../helpers/API/ApiData";

export default function ForgetPassword(props) {
  const history = useHistory();
  const { handleAddUserClose, emailValue } = props;
  const [errors, setErrors] = useState({});
  const [inputValue, setInputValue] = useState();
  const [loader, setLoader] = useState(false);

  const validationData = () => {
    let formIsValid = true;
    let errors = {};
    if (!inputValue?.newPassword) {
      errors["newPassword"] = "* Please enter new password";
      formIsValid = false;
    }
    if (inputValue?.newPassword !== inputValue?.confirmPassword) {
      errors["confirmPassword"] = "* Please enter confirm password";
      formIsValid = false;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (validationData()) {
      setLoader(true);
      const data = {
        email: emailValue?.forgotEmail,
        password: inputValue?.newPassword,
      };

      await ApiPost(`user/updatePassword`, data)
        .then((res) => {
          if (res?.data?.success) {
            setLoader(false);
            history.push("/dashboard");
          } else {
            setLoader(false);
            toast.error(res?.data?.messages);
          }
        })
        .catch((error) => {
          toast.error("password does not updated");
        });
    }
  };
  const [inputType, setInputType] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  return (
    <>
      <div className="modal-content sm-modal-content">
      <Modal.Header
        className="justify-content-start d-flex align-items-center"
        closeButton
      >
        <Modal.Title style={{ color: "#2c4570" }}> Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body class="d-flex flex-column align-items-center justify-content-center">
        <div class="row m-5">
          <div className="col w-100">
            <Label className="form-label" for="Name">
              New Password<span className="text-danger">*</span>
            </Label>
            <div className="align-items-center d-flex position-relative">
              <Input
                type={inputType?.newPassword ? "text" : "password"}
                className={`w-300px`}
                name="newPassword"
                value={inputValue?.newPassword}
                placeholder="New password"
                onChange={handleOnChange}
              />
              <div
                className="cursor-pointer position-absolute"
                style={{ top: "10px", right: "10px" }}
                onClick={() => {
                  setInputType({
                    ...inputType,
                    newPassword: !inputType?.newPassword,
                  });
                }}
              >
                {inputType?.newPassword ? (
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-eye" aria-hidden="true"></i>
                )}
              </div>
            </div>
            <span className="errors">{errors["newPassword"]}</span>
          </div>
        </div>
        <div class="row m-5">
          <div className="col w-100">
            <Label className="form-label" for="Name">
              Confirm Password<span className="text-danger">*</span>
            </Label>
            <div className="align-items-center d-flex position-relative">
              <Input
                className={`w-300px`}
                type={inputType?.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={inputValue?.confirmPassword}
                placeholder="Confirm password"
                onChange={handleOnChange}
              />
              <div
                className="cursor-pointer position-absolute"
                style={{ top: "10px", right: "10px" }}
                onClick={() => {
                  setInputType({
                    ...inputType,
                    confirmPassword: !inputType?.confirmPassword,
                  });
                }}
              >
                {inputType?.confirmPassword ? (
                  <i class="fa fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-eye" aria-hidden="true"></i>
                )}
              </div>
            </div>
            {inputValue?.newPassword && inputValue?.confirmPassword
              ? !(inputValue?.newPassword === inputValue?.confirmPassword) && (
                  <span style={{ color: "red", fontSize: "11px" }}>
                    * Password and Confirm Password must match
                  </span>
                )
              : ""}
            <span className="errors">{errors["confirmPassword"]}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="activebutton h-40px"
          onClick={handleAddUserClose}
          style={{ marginRight: "15px" }}
        >
          Cancel
        </Button>
        <Button className="addbutton" onClick={handleSubmit}>
          <span>Send</span>
          {loader && (
            <div class="h-20px spinner-border text-light w-20px ml-2"></div>
          )}
        </Button>
      </Modal.Footer>
      </div>
    </>
  );
}
