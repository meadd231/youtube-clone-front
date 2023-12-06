import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { Avatar } from "antd";

import CommentArea from "./CommentArea";
import LikeDislike from "./LikeDislike";

import { createAxiosInstance, relativeDate } from "../utils";

const Wrapper = styled.div`
  #title {
    font-family: sans-serif;
    font-size: 20px;
    max-height: 5.6rem;
    line-height: 2.8rem;
    font-weight: 600;
  }

  #subscribe-button {
    background-color: ${(props) => (props.subscribed ? "#e5e5e5" : "#0f0f0f")};
    border-radius: 18px;
    color: ${(props) => (props.subscribed ? "black" : "white")};
    padding: 0 16px;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    text-transform: uppercase;
  }

  .video-metadata {
    display: flex;
  }

  #owner-reference {
    display: flex;
    flex-direction: column;
  }

  #description {
    padding: 5px;
    background-color: #e5e5e5;
    border-radius: 12px;
  }
`;

function VideoInfo({ video }) {
  const [SubscribeNumber, setSubscribeNumber] = useState(video.author.subscribeNum);
  const [Subscribed, setSubscribed] = useState(false);

  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      createAxiosInstance(token).get(`/api/subscribes/${video.writer}/subscribed`).then((res) => {
        if (res.data.success) {
          setSubscribed(res.data.subscribed);
        } else {
          alert("Failed to get Subscribed Information");
        }
      });
    }
  }, []);

  const onSubscribe = () => {
    if (token) {
      createAxiosInstance(token)
        .post("/api/subscribes/subscribe", { writer: video.writer })
        .then((res) => {
          console.log(res.data);
          if (res.data.type === "subscribe") {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(true);
          } else if (res.data.type === "cancel") {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(false);
          }
        });
    } else {
      alert("채널을 구독하려면 로그인하세요.");
    }
  };

  return (
    <Wrapper subscribed={Subscribed}>
      <h1 id="title">{video.title}</h1>
      <div className="video-metadata">
        <Avatar
          src={`http://localhost:3001/uploads/avatars/${video.author.avatar}`}
          style={ {verticalAlign: "middle" }}
          size="large"
          gap={0}
        >
          {video.author.nickname}
        </Avatar>
        <span id="owner-reference">
          <span>{video.author.nickname}</span>
          <span>구독자{SubscribeNumber}명</span>
        </span>
        <button id="subscribe-button" onClick={onSubscribe}>
          {Subscribed ? "구독중" : "구독"}
        </button>
        <LikeDislike video={video} />
      </div>
      <div id="description">
        <span>조회수 {video.views}회</span>
        <span> {!video.createdAt ? "" : relativeDate(video.createdAt)}</span>
        <div>{video.description}</div>
      </div>
      <CommentArea video={video} />
    </Wrapper>
  );
}

/*
채널을 구독하시겠습니까?
채널을 구독하려면 로그인하세요.
로그인(버튼)
*/

export default VideoInfo;
