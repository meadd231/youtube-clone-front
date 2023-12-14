import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { createAxiosInstance } from "../utils";
import { useSelector } from "react-redux";

const Wrapper = styled.div``;

function Channel() {
  const { channelName } = useParams();
  const [Channel, setChannel] = useState();
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
  return !Channel ? (
    <div></div>
  ) : (
    <Wrapper>
      <div style={{ width: "1284px", height: "200px" }}>배너</div>
      <div id="channel-header-container" style={{ display: "flex" }}>
        <img
          alt="avatar"
          src={`${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${Channel.avatar}`}
          style={{ width: "160px", height: "160px", borderRadius: "100px" }}
        />
        <div>
          <div>{Channel.nickname}</div>
          <div>
            <span>{Channel.nickname}</span>
            <span> · 구독자 </span>
            <span>{Channel.subscribeNum}명</span>
            <span> · 동영상 </span>
            <span>{Channel.videoNum}개</span>
          </div>
          <div>정보</div>
          <button>구독 버튼</button>
        </div>
      </div>
      <div>탭</div>
      <div>내용</div>
    </Wrapper>
  );
}

export default Channel;
