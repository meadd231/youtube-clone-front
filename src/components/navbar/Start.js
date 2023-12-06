import React from "react";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { sidebarClose, sidebarOpen } from "../../reducers/sidebar";

import { Link } from "react-router-dom";

import { HamburgerIcon } from "../Icons";

function Start() {
  const { open } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    if (open) {
      dispatch(sidebarClose());
    } else {
      dispatch(sidebarOpen());
    }
  };
  return (
    <div className="start">
      <HamburgerIcon
        className="toggle-navhandler"
        onClick={handleToggleSidebar}
      />
      <span>
        <Link to="/">
          <img
            className="logoImage"
            style={{ padding: "8px" }}
            alt="logo"
            src={process.env.PUBLIC_URL + "/img/Logo.png"}
          />
        </Link>
      </span>
    </div>
  );
}

export default Start;
