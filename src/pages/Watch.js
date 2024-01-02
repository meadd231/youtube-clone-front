import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import VideoInfo from "../components/VideoInfo";
import SideVideo from "../components/SideVideo";
import { createAxiosInstance } from "../utils";
import { useSelector } from "react-redux";

import VideoPlayer from "../components/VideoPlayer";


const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  #primary {
    width: 1280px;
    height: 720px;
  }
  video {
    width: 1280px;
    height: 720px;
  }
`;

function Watch() {
  const [Video, setVideo] = useState({});
  const { videoId } = useParams();
  useEffect(() => {
    createAxiosInstance()
      .get(`/api/videos/${videoId}`)
      .then((res) => {
        console.log('video.data', res.data);
        if (res.data.success) {
          console.log(res.data.video);
          const video = res.data.video;
          video.filePath = video.filePath.slice(3);
          setVideo(video);
        } else {
          alert("Failed to get video Info");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [videoId]);

  console.log("Video.filePath", Video.filePath);
  return Object.keys(Video).length === 0 ? (
    <div>Loading...</div>
  ) : (
    <Wrapper>
      <div id="primary">
        {/* <video controls>
          <source src={`http://localhost:3001/${Video.filePath}`}></source>
        </video> */}
        <VideoPlayer video={Video} />
        <VideoInfo video={Video} />
      </div>
      <SideVideo video={Video} />
    </Wrapper>
  );
}

export default Watch;
