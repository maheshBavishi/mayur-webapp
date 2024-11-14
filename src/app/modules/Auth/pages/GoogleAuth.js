import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ApiPost } from "../../../../helpers/API/ApiData";
import * as userUtil from "../../../../utils/user.util";
import Logo from "../../../../assets/icon/logo.svg";

import * as authUtil from "../../../../utils/auth.util";
import {  useLocation} from "react-router";
// import { NavLink, useHistory, useLocation } from "react-router-dom";

const GoogleAuth = () => {
  const history = useHistory();
  const email = localStorage.getItem("email");  
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");
  const [bool, setBool] = useState({ loader: false });

  

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpValue === "") {
      setError("OTP is required");
    } else {
    setBool({ ...bool, loader: true });
   
      const body = {
        email: email,
        otp: otpValue,
      };
     await ApiPost(`user/verifyOtp`, body )
        .then((res) => {
          authUtil.set2FA(false);
          authUtil.setToken(res?.data?.payload?.token);
          userUtil.setUserInfo(res?.data?.payload);
         
          // window.location.reload();
          setTimeout(() => {
            history.push("/dashboard");
            window.location.reload();
          }, 1000);
           toast.success("Login successfully");
           localStorage.removeItem("email");
        })
        .catch((err) => {
          toast.error(err.response.data?.message);
        });


    }
    setBool({ ...bool, loader: false });

  };
  return (
    <>
      <ToastContainer />
      <div className="login-form login-signin" id="kt_login_signin_form">
      <div className="text-center mb-10 mb-lg-20">
        <div onClick={() => history.push("/")}>
          <img alt="" width="300px" src={Logo} />
        </div>
      </div>
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">Two Factor Authentication</h3>
          <p className="text-muted font-weight-bold">Enter your OTP Sent to Email</p>
          <span className="text-danger h6">{error}</span>
        </div>
        <form>
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="OTP"
              type="number"
              className={`form-control form-control-solid h-auto py-5 px-6  `}
              name="otp"
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
            />
            <span className="text-danger"></span>
          </div>
          <NavLink to="/dashboard">
            <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
              <button
                id="kt_login_signin_submit"
                type="submit"
                className={`align-items-center d-flex btn btn addbutton font-weight-bold px-9 py-4 my-3`}
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                <span className="pr-2">Verify Otp</span>
                {bool.loader && (
                  <div class="spinner-border text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </NavLink>
        </form>
        <p className="text-center">
          <NavLink to="/auth/login">Want to go back ?</NavLink>
        </p>
      </div>
    </>
  );
};

export default GoogleAuth;
