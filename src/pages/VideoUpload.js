import React, { useState } from "react";

import styled from "styled-components";
import { Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

import { createAxiosInstance } from "../utils";
import useInput from "../hooks/useInput";

import LoadingSpinner from "../components/LoadingSpinner";

const { TextArea } = Input;

const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" },
];

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .thumbnail-img {
    width: 127px;
    height: 70px;
    margin: 3px;
  }

  .blur {
    filter: opacity(50%);
    border: none;
  }

  .selected {
    filter: none;
    border: 2px solid black;
  }
`;

function VideoUpload(props) {
  const user = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);
  const title = useInput("");
  const description = useInput("");
  const [SubmitDisabled, setSubmitDisabled] = useState(false);
  const [Title, setTitle] = useState("");
  const [TitleStatus, setTitleStatus] = useState("");
  const [Description, setDescription] = useState("");
  const [DescriptionStatus, setDescriptionStatus] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState();
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState();
  const [Thumbnails, setThumbnails] = useState([]);
  const [SelectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
    if (
      event.currentTarget.value.length > 100 ||
      event.currentTarget.value.length === 0
    ) {
      setSubmitDisabled(true);
      setTitleStatus("error");
    } else {
      setSubmitDisabled(false);
      setTitleStatus("");
    }
  };

  const handleChangeDecsription = (event) => {
    setDescription(event.currentTarget.value);
    if (event.currentTarget.value.length > 5000) {
      setSubmitDisabled(true);
      setDescriptionStatus("error");
    } else {
      setSubmitDisabled(false);
      setDescriptionStatus("");
    }
  };

  const handleChangeOne = (event) => {
    setPrivacy(event.currentTarget.value);
  };

  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value);
  };

  // 동영상 등록 이벤트
  const onSubmit = (event) => {
    event.preventDefault();

    // if (user.userData && !user.userData.isAuth) {
    //   return alert("Please Log in First");
    // }

    if (
      Title === "" ||
      Categories === "" ||
      FilePath === "" ||
      Duration === "" ||
      Thumbnail === ""
    ) {
      return alert("Please first fill all the fields");
    }

    const variables = {
      writer: user.userData.id,
      title: Title,
      description: Description,
      privacy: privacy,
      filePath: FilePath,
      category: Categories,
      duration: Duration,
      thumbnail: Thumbnails[SelectedImageIndex],
    };

    createAxiosInstance()
      .post("/api/videos/video", variables)
      .then((res) => {
        if (res.data.success) {
          alert("video Uploaded Successfully");
          props.history.push("/");
        } else {
          alert("Failed to upload video");
        }
      });
  };

  // 동영상 세팅 이벤트
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    console.log(files);
    formData.append("file", files[0]);
    setLoading(true);
    createAxiosInstance()
      .post("/api/videos/upload-video-file", formData, config)
      .then((response) => {
        if (response.data.success) {
          console.log(response);
          let variable = {
            filePath: response.data.filePath,
            fileName: response.data.fileName,
          };
          setFilePath(response.data.filePath);
          const title = response.data.fileName.split("_")[1].split(".")[0];
          setTitle(title);
          // gerenate thumbnail with this filepath !

          // 나중에 await나 promise chaining으로 변경하기.
          createAxiosInstance()
            .post("/api/videos/thumbnail", variable)
            .then((response) => {
              if (response.data.success) {
                console.log("동영상 길이", response.data.fileDuration);
                setDuration(response.data.fileDuration);
                console.log("썸네일 경로", response.data.thumbsFilePath);
                setThumbnail(response.data.thumbsFilePath);
                const thumbnails = response.data.thumbsFilePaths.split(",");
                console.log("thumbnails", thumbnails);
                setThumbnails(thumbnails);
              } else {
                alert("Failed to make the thumbnails");
              }
            });
        } else {
          alert("failed to save the video in server");
        }
        setLoading(false);
      });
  };

  const thumbnails = Thumbnails.map((thumbnail, index) => {
    return (
      <img
        key={index}
        src={`${process.env.REACT_APP_SERVER_URL}/uploads/thumbnails/${thumbnail}`}
        alt="thumbnail1"
        className={`thumbnail-img ${
          SelectedImageIndex === index ? "selected" : "blur"
        }`}
        onClick={() => setSelectedImageIndex(index)}
      />
    );
  });

  return (
    <Wrapper>
      <div style={{ width: "960px", margin: "2rem auto", display: "flex" }}>
        <div style={{ width: "536px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ display: "block" }}>{Title}</h2>
          </div>

          <Form onSubmit={onSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {!FilePath && !Loading && (
                <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      style={{
                        width: "300px",
                        height: "240px",
                        border: "1px solid lightgray",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <PlusOutlined type="plus" style={{ fontSize: "3rem" }} />
                    </div>
                  )}
                </Dropzone>
              )}
              {Loading && <LoadingSpinner />}
            </div>

            <br />
            <br />
            {FilePath && (
              <div id="video-details">
                <label>제목(필수항목)</label>
                <Input
                  onChange={handleChangeTitle}
                  value={Title}
                  status={TitleStatus}
                />
                <div>{Title.length}/100</div>
                <br />
                <br />
                <label>설명</label>
                <TextArea
                  onChange={handleChangeDecsription}
                  value={Description}
                  status={DescriptionStatus}
                />
                <div>{Description.length}/5000</div>
                <br />
                <br />

                {Thumbnails.length > 0 && (
                  <div id="thumbnail-area">
                    <div>썸네일</div>
                    <p>
                      동영상의 내용을 알려주는 사진을 선택하거나 업로드하세요.
                      시청자의 시선을 사로잡을만한 이미지를 사용해 보세요.{" "}
                      <a href="/">자세히 알아보기</a>
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {thumbnails}
                    </div>
                  </div>
                )}

                <select onChange={handleChangeOne}>
                  {Private.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />

                <select onChange={handleChangeTwo}>
                  {Catogory.map((item, index) => (
                    <option key={index} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />

                <Button
                  type="primary"
                  size="large"
                  onClick={onSubmit}
                  disabled={SubmitDisabled}
                >
                  저장
                </Button>
              </div>
            )}
          </Form>
        </div>
        <div>동영상 미리보기</div>
      </div>
    </Wrapper>
  );
}

export default VideoUpload;
