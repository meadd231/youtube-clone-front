import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { avatarChange } from "../reducers/user";
import axios from "axios";

import { createAxiosInstance } from "../utils";
import { Button } from "antd";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Wrapper = styled.div`
  display: flex;
  .customFileInput,
  #delete-btn {
    display: inline-block;
    padding: 10px;
    height: 25px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  #profile-img {
    width: 200px;
    height: 200px;
  }
`;

function Studio() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [DeleteClicked, setDeleteClicked] = useState(false);
  const { token, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setDeleteClicked(false);
  };

  const confirmClick = () => {
    if (DeleteClicked) {
      createAxiosInstance(token)
        .put("/api/auth/avatar/reset")
        .then((res) => {
          if (res.data.success) {
            dispatch(avatarChange(res.data.avatar))
            setDeleteClicked(false);
          } else {
            alert("게시 실패");
          }
        })
        .catch((err) => {
          console.error("put /api/auth/avatar/reset", err);
        });
    } else if (!DeleteClicked) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      createAxiosInstance(token)
        .put("/api/auth/avatar", formData)
        .then((res) => {
          if (res.data.success) {
            console.log("File uploaded successfully:", res.data);
            dispatch(avatarChange(res.data.avatar))
            setSelectedFile(null);
          } else {
            alert("게시 실패");
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const deleteAvatar = () => {
    // 조건문 추가하기.
    if (userData.avatar !== "avatar.png") {
      setSelectedFile(null);
      setDeleteClicked(true);
    }
  };

  return (
    <Wrapper>
      {selectedFile && !DeleteClicked ? (
        <div>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected File Preview"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </div>
      ) : (
        <img
          id="profile-img"
          src={`http://localhost:3001/uploads/avatars/${
            DeleteClicked ? "avatar.png" : userData.avatar
          }`}
          alt="이미지"
        />
      )}
      <label htmlFor="fileInput" className="customFileInput">
        변경
        <input
          id="fileInput"
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </label>
      <div id="delete-btn" onClick={deleteAvatar}>
        삭제
      </div>
      <Button
        id="cancel-btn"
        onClick={() => {
          setDeleteClicked(false);
          setSelectedFile(null);
        }}
        {...(selectedFile || DeleteClicked
          ? { type: "primary" }
          : { disabled: true })}
      >
        취소
      </Button>
      <Button
        id="confirm-btn"
        onClick={confirmClick}
        {...(selectedFile || DeleteClicked
          ? { type: "primary" }
          : { disabled: true })}
      >
        게시
      </Button>
    </Wrapper>
  );
}

export default Studio;
