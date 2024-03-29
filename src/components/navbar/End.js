import React, { useState } from "react";

import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { ProfileIcon, UploadIcon } from "../Icons";
import { Tooltip, Avatar } from "antd";

import UserModal from "../UserModal";
import UploadModal from "../UploadModal";

function End() {
  const { token, userData } = useSelector((state) => state.user);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const location = useLocation();
  const loginedUi = (
    <>
      <Tooltip placement="bottom" title={"만들기"} arrow={false}>
        <UploadIcon
          className="upload-icon"
          onClick={() => setUploadModalOpen(true)}
        />
      </Tooltip>
      {uploadModalOpen && (
        <UploadModal
          closeUploadModal={() => setUploadModalOpen(false)}
        ></UploadModal>
      )}
      <Avatar
        src={`${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${userData.avatar}`}
        style={{ verticalAlign: "middle" }}
        gap={0}
        onClick={() => setUserModalOpen(true)}
      >
        {userData.nickname}
      </Avatar>
      {userModalOpen && (
        <UserModal closeUserModal={() => setUserModalOpen(false)}></UserModal>
      )}
    </>
  );
  const notLoginedUi = (
    <>
      <Link to="/login" state={{ prev: location.pathname }}>
        <div
          className="login-btn"
          style={{ color: "#065fd4", display: "flex" }}
        >
          <ProfileIcon />
          <div>로그인</div>
        </div>
      </Link>
    </>
  );
  return (
    <div className="end">
      {token ? loginedUi : notLoginedUi}
    </div>
  );
}

export default End;
