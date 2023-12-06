import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import { HamburgerIcon, MicIcon, UploadIcon, ProfileIcon } from "../Icons";
import { Avatar, Tooltip } from "antd";

import { sidebarOpen, sidebarClose } from "../../reducers/sidebar";
import { useSelector, useDispatch } from "react-redux";

import UploadModal from "../UploadModal";
import UserModal from "../UserModal";
import Start from "./Start";
import Center from "./Center";

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
  const { token, userData } = useSelector((state) => state.user);


  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const showUploadModal = (open = true) => {
    setUploadModalOpen(open);
  };

  const closeUploadModal = () => {
    showUploadModal(false);
  };

  const [userModalOpen, setUserModalOpen] = useState(false);

  const showUserModal = (open = true) => {
    setUserModalOpen(open);
  };

  const closeUserModal = () => {
    setUserModalOpen(false);
  };

  return (
    <Wrapper>
      <div className="navbar">
        <Start />
        <Center />

        <div className="end">
          {token ? (
            <>
              <Tooltip placement="bottom" title={"만들기"} arrow={false}>
                <UploadIcon className="upload-icon" onClick={showUploadModal} />
              </Tooltip>
              {uploadModalOpen && (
                <UploadModal closeUploadModal={closeUploadModal}></UploadModal>
              )}
              <Avatar
                src={`http://localhost:3001/uploads/avatars/${userData.avatar}`}
                style={{ verticalAlign: "middle" }}
                gap={0}
                onClick={showUserModal}
              >
                {userData.nickname}
              </Avatar>
              {userModalOpen && (
                <UserModal closeUserModal={closeUserModal}></UserModal>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <div
                  className="login-btn"
                  style={{ color: "#065fd4", display: "flex" }}
                >
                  <ProfileIcon />
                  <div>로그인</div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default Navbar;
