import React from "react";

import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { relativeDate } from "../utils";


function VideoCard({ video }) {
  return (
    <Link
      to={"watch/" + video.id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <img
        alt={"thumbnail"}
        style={{ width: "100%", height: "200px" }}
        src={"http://localhost:3001/uploads/thumbnails/" + video.thumbnail}
      />
      <div style={{ display: "flex" }}>
        <Avatar
          src={`http://localhost:3001/uploads/avatars/${video.author.avatar}`}
        />
        <div>
          <div
            style={{ color: "#0f0f0f", fontSize: "16px", fontWeight: "500" }}
          >
            {video.title}
          </div>
          <div style={{ color: "#606060", fontSize: "14px" }}>
            <div id="writer">{video.author.nickname}</div>
            <span>조회수 {video.views}</span>
            <span> · </span>
            <span>{relativeDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
