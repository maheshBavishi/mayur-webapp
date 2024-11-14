/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Auth from "../../../../../helpers/Auth";
import { getUserInfo } from "../../../../../utils/user.util";
import {
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { User, Power } from "react-feather";
import { Link } from "react-router-dom";
// import admin from "../../../../../assets/icon/admin.png";
// import superadmin from "../../../../../assets/icon/superadmin.jpg";
// import { Avatar } from "@material-ui/core";

export function UserProfileDropdown() {
  let userInfo = getUserInfo();

  const Logout = async () => {
    await Auth.deauthenticateLocalUser();
    window.location.reload();
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* <UncontrolledDropdown tag="li" className="dropdown-user nav-item"> */}
      <Dropdown
        isOpen={isOpen}
        toggle={toggle}
        className="dropdown-user nav-item dropdown-user-sc"
      >

        {userInfo?.role === "admin" ? (
          <DropdownToggle
            href="/"
            tag="a"
            className="nav-link dropdown-user-link"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              color: "#2c4570",
            }}
          >
            <>
              <div className="user-nav d-sm-flex d-none ">
                <span
                  className="user-name fw-bold col"
                  style={{ fontWeight: "bold" }}
                >
                  Super Admin
                </span>
              </div>
              {/* <Avatar src={superadmin} imgHeight="40" imgWidth="40" status="online" /> */}
              <span className="symbol symbol-35 symbol-light-primary">
                <span className="symbol-label font-size-h5 font-weight-bold">
                  {userInfo?.role?.toUpperCase()[0] + ". "}
                </span>
              </span>
            </>
          </DropdownToggle>
        ) : (
          <>

            <div className="user-nav d-sm-flex d-none " style={{display:"flex"}}>
              <span
                className="user-name fw-bold col"
                style={{ fontWeight: "bold" , color:"#2c4570",display:"flex" , alignItems:"center" }}
              >
              { userInfo?.name }
              </span>
            </div>
            {/* <Avatar src={superadmin} imgHeight="40" imgWidth="40" status="online" /> */}
            <span className="symbol symbol-35 symbol-light-primary">
              <span className="symbol-label font-size-h5 font-weight-bold">
                {userInfo?.name?.toUpperCase()[0] + ". "}
              </span>
            </span>
           
          </>
        )}

        <DropdownMenu end>
          <DropdownItem tag={Link} toggle={toggle} to={"/profile"}>
            <User size={14} className="me-75" />
            <span className="align-middle">Profil</span>
          </DropdownItem>

          <DropdownItem tag={Link} to="/auth/login" onClick={Logout}>
            <Power size={14} className="me-75" />
            <span className="align-middle">Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {/* </UncontrolledDropdown> */}
    </>
  );
}
