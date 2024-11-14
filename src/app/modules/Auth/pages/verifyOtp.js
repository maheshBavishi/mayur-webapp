import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { ApiPost } from "../../../../helpers/API/ApiData";
import ForgetPassword from "./ForgetPassword";

const VerifyOtp = (props) => {
  const { emailValue, setEmailValue } = props;
  const [passwordForget, setPasswordForget] = useState(false);
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);

  const handleAddUserClose = () => {
    setPasswordForget(false);
  };

  const handleChange = (e) => {
    setEmailValue({ ...emailValue, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleVerifyOTP = () => {
    if (!emailValue?.verifyOtp) {
      setErrors({ ...errors, verifyOtp: "Please enter otp*" });
    } else {
      setLoader(true);
      let data = {
        email: emailValue?.forgotEmail,
        otp: emailValue?.verifyOtp,
      };
      ApiPost(`user/verifyOtp`, data)
        .then((res) => {
          if (res?.status === 200) {
            setLoader(false);
            setPasswordForget(true);
            toast.success("Otp send successfully");
          }
        })
        .catch((err) => {
          setLoader(false);
          toast.error(err?.response?.data?.message);
        });
    }
  };

  return (
    <>
      <div className="form-group fv-plugins-icon-container">
        <input
          placeholder="Otp"
          type="number"
          className={`form-control form-control-solid h-auto py-5 px-6  `}
          name="verifyOtp"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <span className="text-danger">{errors.verifyOtp}</span>
      </div>

      <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
        <button
          className={`align-items-center d-flex btn btn addbutton font-weight-bold px-9 py-4 my-3`}
          onClick={() => handleVerifyOTP()}
        >
          Verify Otp
          {loader && (
            <div class="spinner-border text-light" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
        </button>
      </div>

      <Modal show={passwordForget} onHide={handleAddUserClose} centered>
        <ForgetPassword
          handleAddUserClose={handleAddUserClose}
          forgetPassword={passwordForget}
          emailValue={emailValue}
          setEmailValue={setEmailValue}
        />
      </Modal>
    </>
  );
};

export default VerifyOtp;
