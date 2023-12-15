import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { createAxiosInstance } from "../utils";
import { useSelector } from "react-redux";

import { Tabs } from "antd";

const Wrapper = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;

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
`;

function Channel() {
  const { channelName } = useParams();
  const [Channel, setChannel] = useState();
  const [Subscribed, setSubscribed] = useState(false);
  // channel 정보 가져오기 axios
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    createAxiosInstance(token)
      .get(`${process.env.REACT_APP_SERVER_URL}/api/channels/${channelName}`)
      .then((res) => {
        if (res.data.success) {
          console.log("get api/channels/:channelName", res.data);
          setChannel(res.data.channel);
        } else {
          alert("채널 정보 조회 실패");
        }
      });
  }, []);

  const onSubscribe = () => {
    // if (token) {
    //   createAxiosInstance(token)
    //     .post("/api/subscribes/subscribe", { writer: video.writer })
    //     .then((res) => {
    //       console.log(res.data);
    //       if (res.data.type === "subscribe") {
    //         setSubscribeNumber(SubscribeNumber + 1);
    //         setSubscribed(true);
    //       } else if (res.data.type === "cancel") {
    //         setSubscribeNumber(SubscribeNumber - 1);
    //         setSubscribed(false);
    //       }
    //     });
    // } else {
    //   alert("채널을 구독하려면 로그인하세요.");
    // }
  };

  const onChange = (key) => {
    console.log(key);
  };
  const home = (
    <div>
      <div>추천</div>
      <div>Shorts</div>
      <div>동영상</div>
      <div>여러 재생목록</div>
    </div>
  )
  const videos = (
    <div>
      <div>최신순 인기순 날짜순</div>
      <div>동영상 리스트</div>
    </div>
  )
  const playlists = (
    <div>생성된 재생목록</div>
  )
  const items = [
    {
      key: "1",
      label: "홈",
      children: home,
    },
    {
      key: "2",
      label: "동영상",
      children: videos,
    },
    {
      key: "3",
      label: "재생목록",
      children: playlists,
    },
  ];
  return !Channel ? (
    <div></div>
  ) : (
    <Wrapper subscribed={Subscribed}>
      <div>
        {Channel.bannerImg && (
          <div style={{ width: "1284px", height: "200px" }}>배너</div>
        )}
        <div id="channel-header-container" style={{ display: "flex" }}>
          <img
            alt="avatar"
            src={`${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${Channel.avatar}`}
            style={{ width: "160px", height: "160px", borderRadius: "100px" }}
          />
          <div>
            <div style={{ fontSize: "36px"}}>{Channel.nickname}</div>
            <div>
              <span>{Channel.nickname}</span>
              <span> · 구독자 </span>
              <span>{Channel.subscribeNum}명</span>
              <span> · 동영상 </span>
              <span>{Channel.videoNum}개</span>
            </div>
            <div>정보 {'>'}</div>
            <button id="subscribe-button" onClick={onSubscribe}>
              {Subscribed ? "구독중" : "구독"}
            </button>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </Wrapper>
  );
}

export default Channel;
