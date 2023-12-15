import React from "react";
import styled from "styled-components";

import Start from "./Start";
import Center from "./Center";
import End from "./End";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: block;
  z-index: 1020;
  background-color: white;

  .navbar {
    height: 56px;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .toggle-navhandler,
  .upload-icon,
  .mic-btn {
    padding: 8px;
  }

  .toggle-navhandler:hover,
  .upload-icon:hover, .mic-btn:hover {
    background-color: #e5e5e5;
    border-radius: 24px;
  }

  .start, .center, .end {
    display: flex;
    flex-direction: row;
  }

  .search-container {
    display: flex;
    height: 40px;
    width: 536px;
  }

  .search-box {
    flex: 1;
    border-radius: 40px 0 0 40px;
  }

  .search-button {
    border-radius: 0 40px 40px 0;
  }

  .login-btn:hover {
    background-color: #e5e5e5;
  }
`;

function Navbar() {
  return (
    <Wrapper>
      <div className="navbar">
        <Start />
        <Center />
        <End />
      </div>
    </Wrapper>
  );
}

export default Navbar;
