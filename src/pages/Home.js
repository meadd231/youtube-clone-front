import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import VideoCard from "../components/VideoCard";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 20px;
  flex: 1;
  margin: 0 16px;

  .grid-item {
    max-width:360px;
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
        <VideoCard video={video} />
      </div>
    );
  });
  console.log("videoCards", videoCards);
  return <Wrapper id="grid-container">{videoCards}</Wrapper>;
}

export default Home;
