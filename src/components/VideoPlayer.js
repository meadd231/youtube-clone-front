import React, { useRef, useEffect } from "react";

import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';

function VideoPlayer({ video }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Video.js 초기화 및 설정
    // const player = videojs(videoRef.current, {
    //   controls: true,
    //   autoplay: true,
    //   sources: [
    //     {
    //       src: `http://localhost:3001/${video.filePath}`,
    //       type: "video/mp4",
    //     },
    //     // 추가적인 비디오 포맷에 대한 소스 추가 가능
    //   ],
    // });

    let player = new Player({
      id: 'mse',
      url: `http://localhost:3001/${video.filePath}`,
      height: '100%',
      width: '100%',
    });


    // 컴포넌트가 언마운트될 때 Video.js 인스턴스 정리
    // return () => {
    //   if (player) {
    //     player.dispose();
    //   }
    // };
  }, []);
  return (
    // <div data-vjs-player>
    //   <video ref={videoRef} className="video-js" />
    // </div>
    <div id="mse"></div>
  );
}

export default VideoPlayer;
