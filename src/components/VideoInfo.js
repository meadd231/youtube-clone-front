import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar } from "antd";

import CommentArea from "./comment/CommentArea";
import LikeDislike from "./LikeDislike";
import SubscribeButton from "./SubscribeButton";

import { createAxiosInstance, relativeDate } from "../utils";

const Wrapper = styled.div`
  #title {
    font-family: sans-serif;
    font-size: 20px;
    max-height: 5.6rem;
    line-height: 2.8rem;
    font-weight: 600;
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
  const [SubscribeNumber, setSubscribeNumber] = useState(
    video.author.subscribeNum
  );

  const { token } = useSelector((state) => state.user);

  const increaseOrdecreaseSubNum = (bool) => {
    if (bool) {
      setSubscribeNumber(SubscribeNumber + 1);
    } else {
      setSubscribeNumber(SubscribeNumber - 1);
    }
  };

  return (
    <Wrapper>
      <h1 id="title">{video.title}</h1>
      <div className="video-metadata">
        <Avatar
          src={`${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${video.author.avatar}`}
          style={{ verticalAlign: "middle" }}
          size="large"
          gap={0}
        >
          {video.author.nickname}
        </Avatar>
        <span id="owner-reference">
          <span>{video.author.nickname}</span>
          <span>구독자{SubscribeNumber}명</span>
        </span>
        <SubscribeButton
          channelId={video.writer}
          SubscribeNumber={SubscribeNumber}
          setSubscribeNumber={setSubscribeNumber}
        />
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
