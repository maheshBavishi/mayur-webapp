/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import Changepassword from "../pages/changepassowrd";
import "swiper/swiper.scss";


import GoogleAuth from "./GoogleAuth";
import ForgotPassword from "../pages/changepassowrd";

export function AuthPage() {
  // const history = useHistory();
  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
          id="kt_login"
        >
          <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0 form-sc">
              <Switch>
                <ContentRoute path="/auth/login" component={Login} />
                <ContentRoute
                  path="/auth/google-login"
                  component={GoogleAuth}
                />
                <ContentRoute
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                />
                <ContentRoute
                  path="/changepassword"
                  component={Changepassword}
                />

                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
