import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { createAxiosInstance } from "../utils";
import { useSelector } from "react-redux";

import { Tabs } from "antd";

import ChannelInfoModal from "../components/ChannelInfoModal";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";

const Wrapper = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

function Channel() {
  const { channelName } = useParams();
  const [Channel, setChannel] = useState();
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [ChannelInfoModalOpened, setChannelInfoModalOpened] = useState(false);
  const [VideoOrder, setVideoOrder] = useState(1);
  const [ChannelVideos, setChannelVideos] = useState([]);
  // channel 정보 가져오기 axios
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    createAxiosInstance(token)
      .get(`${process.env.REACT_APP_SERVER_URL}/api/users/${channelName}`)
      .then((res) => {
        if (res.data.success) {
          console.log("get api/channels/:channelName", res.data);
          setChannel(res.data.channel);
        } else {
          alert("채널 정보 조회 실패");
        }
      });
  }, []);

  useEffect(() => {
    if (Channel) {
      createAxiosInstance(token)
        .get(`${process.env.REACT_APP_SERVER_URL}/api/videos/${Channel.id}`)
        .then((res) => {
          if (res.data.success) {
            console.log("get api/videos/:channelId", res.data);
            setChannelVideos(res.data.channelVideos);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [Channel, VideoOrder]);

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
  );
  const videosTabItems = [
    {
      key: "1",
      label: "최신순",
    },
    {
      key: "2",
      label: "인기순",
    },
    {
      key: "3",
      label: "날짜순",
    },
  ];
  const videoCards = ChannelVideos.map((video, i) => {
    return (
      <div className="grid-item" key={i}>
        <VideoCard video={video} />
      </div>
    );
  });
  const videos = (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={videosTabItems}
        onChange={(key) => setVideoOrder(key)}
      />
      <div>{videoCards}</div>
    </div>
  );
  const playlists = <div>생성된 재생목록</div>;
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
    <Wrapper>
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
            <div style={{ fontSize: "36px" }}>{Channel.nickname}</div>
            <div>
              <span>{Channel.nickname}</span>
              <span> · 구독자 </span>
              <span>{Channel.subscribeNum}명</span>
              <span> · 동영상 </span>
              <span>{Channel.videoNum}개</span>
            </div>
            <div onClick={() => setChannelInfoModalOpened(true)}>
              정보 {">"}
            </div>
            {ChannelInfoModalOpened && (
              <ChannelInfoModal
                setChannelInfoModalOpened={setChannelInfoModalOpened}
              />
            )}
            <SubscribeButton
              channelId={Channel.id}
              SubscribeNumber={SubscribeNumber}
              setSubscribeNumber={setSubscribeNumber}
            />
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </Wrapper>
  );
}

export default Channel;
