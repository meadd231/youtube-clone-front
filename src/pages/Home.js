import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

import VideoCard from "../components/VideoCard";

import { relativeDate } from "../utils";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  flex: 1;
  margin: 0 16px;

  .grid-item {
    background-color: #f0f0f0;
    padding: 20px;
    height: 300px;
  }
`;

function Home() {
  const [Videos, setVideos] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/videos`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        console.log("res.data.videos", res.data.videos);
        const copiedVideos = new Array(10).fill(res.data.videos).flat();
        setVideos(copiedVideos);
      });
  }, []);

  const videoCards = Videos.map((video, i) => {
    return (
      <div className="grid-item" key={i}>
        <VideoCard video={video}/>
      </div>
    );
  });
  console.log("videoCards", videoCards);
  return <Wrapper>{videoCards}</Wrapper>;
}

export default Home;
