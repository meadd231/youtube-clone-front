import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HamburgerIcon, MicIcon, UploadIcon, ProfileIcon } from "./Icons";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: block;
  z-index: 2020;

  .navbar {
    height: 56px;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .start {
    display: flex;
    flex-direction: row;
  }

  .toggle-navhandler:hover,
  .upload-icon:hover {
    background-color: gray;
    border-radius: 24px;
  }

  .logoImage {
    padding-left: 16px;
  }

  .center {
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

  .end {
    display: flex;
    flex-direction: row;
  }

  .login-btn:hover {
    background-color: gray;
  }
`;

function Navbar() {
  const { token } = useSelector((state) => state.user);
  console.log("token", token);
  let nickname = '';
  if (token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload)); // Base64 디코딩 후 JSON 파싱
    nickname = decodedPayload.nickname;
    console.log(decodedPayload);
  }
  return (
    <Wrapper>
      <div className="navbar">
        <div className="start">
          <HamburgerIcon
            className="toggle-navhandler"
            // onClick={handleToggleSidebar}
          />
          <span>
            <Link to="/">
              <img className="logoImage" alt="iPhone_01" src="img/Logo.png" />
            </Link>
          </span>
        </div>
        <div className="center">
          <div className="search-container">
            <input
              className="search-box"
              type="text"
              placeholder="검색"
              // value={searchterm.value}
              // onKeyDown={handleSearch}
              // onChange={searchterm.onChange}
            />
            <button className="search-button">검색</button>
          </div>
          <MicIcon />
        </div>

        {token ? (
          <div className="end">
            <UploadIcon className="upload-icon" />
            <div>{nickname}</div>
          </div>
        ) : (
          <div className="end">
            <Link to="/login">
              <div
                className="login-btn"
                style={{ color: "#065fd4", display: "flex" }}
              >
                <ProfileIcon />
                <div>로그인</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default Navbar;
