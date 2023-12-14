import React, { useState } from "react";

import styled from "styled-components";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

import { ImageUploadIcon, XIcon } from "../components/Icons";

import { createAxiosInstance } from "../utils";

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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1050;

  .video-upload-modal {
    width: 960px;
    height: 960px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background: rgba(255, 255, 255, 1);
    z-index: 1060;
  }

  .content {
    display: flex;
    justify-content: center;
  }

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

function VideoUploadModal(props) {
  const user = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);
  const [SubmitDisabled, setSubmitDisabled] = useState(false);
  const [Title, setTitle] = useState("");
  const [TitleStatus, setTitleStatus] = useState("");
  const [Description, setDescription] = useState("");
  const [DescriptionStatus, setDescriptionStatus] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState();
  const [Duration, setDuration] = useState("");
  const [Thumbnails, setThumbnails] = useState([]);
  const [CustomThumbnailFile, setCustomThumbnailFile] = useState();
  const [SelectedImageIndex, setSelectedImageIndex] = useState(1);

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
  const postVideo = async () => {
    // if (user.userData && !user.userData.isAuth) {
    //   return alert("Please Log in First");
    // }

    if (
      Title === "" ||
      Categories === "" ||
      FilePath === "" ||
      Duration === ""
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

    // 커스텀 썸네일 처리 해줘야 함.
    if (SelectedImageIndex === 0) {
      try {
        const formData = new FormData();
        formData.append("file", CustomThumbnailFile);
        console.log("formData", formData);
        const res = await createAxiosInstance().post(
          `${process.env.REACT_APP_SERVER_URL}/api/videos/custom-thumbnail`,
          formData
        );
        if (res.data.success) {
          variables.thumbnail = res.data.uploadedFileName;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }

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

  const useCustomthumbnail = (event) => {
    const file = event.target.files[0];
    Thumbnails[0] = URL.createObjectURL(file);
    setCustomThumbnailFile(file);
    setThumbnails([...Thumbnails]);
    setSelectedImageIndex(0);
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
                console.log("썸네일 경로", response.data.thumbsFilePaths);
                const thumbnails = response.data.thumbsFilePaths.split(",");
                console.log("thumbnails", thumbnails);
                setThumbnails([null, ...thumbnails]);
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
    if (index === 0) {
      return;
    }
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
      <div className="video-upload-modal">
        <div
          className="header"
          style={{ display: "flex", justifyContent: "right" }}
        >
          <XIcon onClick={props.closeModal} />
        </div>
        <div className="content">
          <div style={{ width: "536px" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2>{Title}</h2>
            </div>

            {!FilePath && !Loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                <div>동영상 파일을 드래그 앤 드롭하여 업로드</div>
                <div>동영상을 게시하기 전에는 비공개로 설정됩니다.</div>
                <Button>파일 선택</Button>
              </div>
            )}
            {Loading && <LoadingSpinner />}

            {FilePath && (
              <div id="video-details">
                <label>제목(필수항목)</label>
                <Input
                  onChange={handleChangeTitle}
                  value={Title}
                  status={TitleStatus}
                />
                <div>{Title.length}/100</div>
                <label>설명</label>
                <TextArea
                  onChange={handleChangeDecsription}
                  value={Description}
                  status={DescriptionStatus}
                />
                <div>{Description.length}/5000</div>

                {Thumbnails.length > 0 && (
                  <div id="thumbnail-area">
                    <div>썸네일</div>
                    <p>
                      동영상의 내용을 알려주는 사진을 선택하거나 업로드하세요.
                      시청자의 시선을 사로잡을만한 이미지를 사용해 보세요.{" "}
                      <a href="/">자세히 알아보기</a>
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {Thumbnails[0] ? (
                        <img
                          key="0"
                          src={`${Thumbnails[0]}`}
                          alt="thumbnail1"
                          className={`thumbnail-img ${
                            SelectedImageIndex === 0 ? "selected" : "blur"
                          }`}
                          onClick={() => setSelectedImageIndex(0)}
                        />
                      ) : (
                        <div
                          className="thumbnail-img"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px dashed rgba(0, 0, 0, 0.1)",
                            position: "relative",
                          }}
                        >
                          <ImageUploadIcon />
                          <span>썸네일 업로드</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={useCustomthumbnail}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      )}
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

                <select onChange={handleChangeTwo}>
                  {Catogory.map((item, index) => (
                    <option key={index} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <Button
                  type="primary"
                  size="large"
                  onClick={postVideo}
                  disabled={SubmitDisabled}
                >
                  저장
                </Button>
              </div>
            )}
          </div>
          {FilePath && <div>동영상 미리보기</div>}
        </div>
      </div>
    </Wrapper>
  );
}

export default VideoUploadModal;
