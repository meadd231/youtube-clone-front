import React, { useState } from "react";

import VideoUploadModal from "../components/VideoUploadModal";

function VideosUpload() {
  const [VideoModalOpened, setVideoModalOpened] = useState(false);
  const handleVideoUpload = () => {
    setVideoModalOpened(!VideoModalOpened);
  };
  return (
    <>
      <button
        onClick={handleVideoUpload}
        style={{ width: "127px", height: "70px" }}
      >
        비디오 업로드
      </button>
      {VideoModalOpened && <VideoUploadModal closeModal={handleVideoUpload}/>}
    </>
  );
}

export default VideosUpload;
