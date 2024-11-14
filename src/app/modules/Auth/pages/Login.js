import React, { useState } from "react";
import { NavLink, useHistory, Redirect } from "react-router-dom";
import { ApiPost } from "../../../../helpers/API/ApiData";
import * as authUtil from "../../../../utils/auth.util";
import * as userUtil from "../../../../utils/user.util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../../_metronic/_assets/sass/layout/_basic.scss";
import VerifyOtp from "./verifyOtp";
import homepageicon from "../../../../assets/images/logintitle.svg";
import weprologinlogo from "../../../../assets/images/weprologologin.svg";
import weprologinskatch from "../../../../assets/images/weprologontitle.png";

export default function Login() {
  const history = useHistory();
  const [loginData, setLoginData] = useState({});
  const [errors, setErrors] = useState({});
  const [bool, setBool] = useState({ loader: false });
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [emailValue, setEmailValue] = useState();
  const regexEmail = /^(([^<>()[\],;:\s@]+([^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+)+[^<>()[\],;:\s@]{2,})$/i;
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleChangeForgotEmail = (e) => {
    setEmailValue({ ...emailValue, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    setBool({ ...bool, loader: true });
    e.preventDefault();

    if (!loginData.emailId && !loginData.password) {
      setErrors({
        emailId: "Email is required*",
        password: "Password is required*",
        roleId: "6316d71dec63d255184b332c",
      });
    } else if (loginData.emailId === "" && loginData.password === "") {
      setErrors({ ...errors, emailId: "Email is required*" });
    } else if (!loginData.emailId || loginData.emailId === "") {
      setErrors({ ...errors, emailId: "Email is required*" });
    } else if (!loginData.emailId || regexEmail.test(loginData.emailId) === false) {
      setErrors({ ...errors, emailId: "Email is not valid*" });
    } else if (!loginData.password || loginData.password === "") {
      setErrors({ ...errors, password: "Password is required*" });
    } else {
      loginData.emailId = loginData.emailId.toLowerCase();
      const body = {
        email: loginData.emailId.toLowerCase(),
        password: loginData.password,
      };

      await ApiPost("user/adminSignin", body)
        .then((res) => {
          if (res?.status === 200) {
            if (res?.data?.payload?.role == "user") {
              authUtil.set2FA(false);
              authUtil.setToken(res?.data?.payload?.token);
              userUtil.setUserInfo(res?.data?.payload);
              setTimeout(() => {
                history.push("/eingereichteLeads");
                window.location.reload();
              }, 100);
            } else {
              toast.error("Benutzer nicht gefunden");
            }
          }
        })
        .catch((error) => {
          toast.error(error.response?.data?.message ? error.response?.data?.message : "Oops something wrong");
        });
    }
    setBool({ ...bool, loader: false });
  };

  const handleEmailValidate = () => {
    let isValid = true;
    if (!emailValue?.forgotEmail || regexEmail.test(emailValue?.forgotEmail) === false) {
      setErrors({ ...errors, forgotEmail: "Email is not valid*" });
      isValid = false;
    }
    return isValid;
  };

  const sendEmail = () => {
    if (handleEmailValidate()) {
      setPasswordLoader(true);
      let data = {
        email: emailValue?.forgotEmail,
      };
      ApiPost(`user/sendEmail`, data)
        .then((res) => {
          if (res) {
            // setVerifyOtp(true);
            setPasswordLoader(false);
            toast.success("E-Mail erfolgreich gesendet");
            setTimeout(() => {
              history.push("/auth/login");
              window.location.reload();
            }, 200);
          }
        })
        .catch((err) => {
          toast.error("Der Administrator kann das Passwort nicht ändern");
          setPasswordLoader(false);
        });
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="main-design-logo-flex">
          <div>
            <img src={weprologinlogo} />
          </div>
        </div>
        <div className="weoprologin-mx">
          <img src={weprologinlogo} />
        </div>

        <div className="login-form login-signin login-width" id="kt_login_signin_form">
          <div className="text-center mb-10 mb-lg-20"></div>
          <div className="text-center mb-10 mb-lg-20 new-design">
            <h3 className="font-size-h1">Anmelden</h3>
            <p className=" font-weight-bold new-under-design">2Park</p>
            <span className="text-danger h6">{errors.user}</span>
          </div>

          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
          <form onSubmit={onFormSubmit}>
            {forgetPassword === false ? (
              <>
                <div className="form-group fv-plugins-icon-container" style={{ border: "1px solid #26372e", borderRadius: "5px" }}>
                  <div className="input-alignment input-alignment-sc">
                    <input
                      placeholder="Email"
                      type="email"
                      className={`email-input-sc form-control form-control-solid h-auto py-5`}
                      name="emailId"
                      style={{
                        width: "398px",
                        height: "52px",
                        outline: "none",
                      }}
                      value={loginData?.emailId}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
                <span className="text-danger">{errors.emailId}</span>

                <div
                  className="d-flex align-items-center form-control form-control-lg form-control-solid  input-alignment form-inp-sc"
                  style={{
                    height: "52px",
                    border: "1px solid #26372e",
                    borderRadius: "5px",
                    paddingLeft: "11px",
                  }}
                >
                  <input style={{ outline: "none", width: "382px" }} type={showPassword ? "text" : "password"} className="w-100 bg-transparent border border-transparent h-100 " name="password" placeholder="Passwort" onChange={handleChange} />
                  <div className="cursor-pointer">
                    {showPassword ? (
                      <i className="fa fa-eye-slash" aria-hidden="true" onClick={() => setShowPassword(!showPassword)} style={{ fontSize: "20px" }}></i>
                    ) : (
                      <i className="fa fa-eye" aria-hidden="true" onClick={() => setShowPassword(!showPassword)} style={{ fontSize: "20px" }}></i>
                    )}
                  </div>
                </div>
                <span className="text-danger">{errors.password}</span>

                {/* <div className="forget-password-text">
                  <span onClick={() => setForgetPassword(true)}>Passwort vergessen</span>
                </div> */}
              </>
            ) : (
              <div className="form-group fv-plugins-icon-container" style={{ width: "300px" }}>
                <input
                  placeholder="Email"
                  // type="email"
                  className={`form-control form-control-solid h-auto py-5 px-6  `}
                  name="forgotEmail"
                  value={emailValue?.forgotEmail}
                  onChange={(e) => {
                    handleChangeForgotEmail(e);
                  }}
                />
                <span className="text-danger">{errors.forgotEmail}</span>
              </div>
            )}

            {forgetPassword === false ? (
              <>
                <div style={{ opacity: "1" }} className="form-group d-flex flex-wrap justify-content-center align-items-center ">
                  <button
                    id="kt_login_signin_submit"
                    type="submit"
                    className={`align-items-center d-flex btn btn  font-weight-bold my-15 new-class-design `}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                    style={{ background: " #2C4570", opacity: "1" }}
                    // style={{ background: " #26372E", opacity: "1" }}
                  >
                    <span className=" new-class-desig-vddwsas">Einloggen</span>
                    {bool.loader && (
                      <div class="spinner-border text-light" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ opacity: "1" }} className="form-group d-flex flex-wrap justify-content-center align-items-center">
                  <button className={`align-items-center d-flex btn btn addbutton font-weight-bold px-9 py-4 `} onClick={() => sendEmail()}>
                    E-Mail senden
                    {passwordLoader && (
                      <div class="spinner-border text-light" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  <p onClick={() => setForgetPassword(!forgetPassword)}>Zurück gehen wollen?</p>
                </div>
              </>
            )}
          </form>
        </div>

        {/* <div className="login-page-skatch-image-div">
          <img src={weprologinskatch} />
        </div> */}
      </div>
    </>
  );
}
