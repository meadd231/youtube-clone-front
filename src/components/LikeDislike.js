import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  LikeOnIcon,
  LikeOffIcon,
  DislikeOnIcon,
  DislikeOffIcon,
} from "./Icons";

import { createAxiosInstance } from "../utils";

const Wrapper = styled.div`
  display: inline;

  button {
    background-color: #e5e5e5;
    border-radius: 18px;
    padding: 0 16px;
    height: 36px;
    font-weight: 500;
    font-size: 14px;
    text-transform: uppercase;
  }

  // #like {
  //   background-color: ${(props) => (props.liked ? "#e5e5e5" : "#000000")};
  //   border-color: ${(props) => (props.liked ? "#e5e5e5" : "#000000")};
  //   color: ${(props) => (props.liked ? "black" : "white")};
  // }

  // #dislike {
  //   background-color: ${(props) => (props.disliked ? "#e5e5e5" : "#000000")};
  //   color: ${(props) => (props.disliked ? "black" : "white")};
  // }
`;

function LikeDislike({ video }) {
  const { token } = useSelector((state) => state.user);
  const [Likes, setLikes] = useState(0);
  const [Liked, setLiked] = useState(false);
  const [Disliked, setDisliked] = useState(false);
  console.log("LikeDislike video", video);
  useEffect(() => {
    // 토큰이 없으면 그냥 막으면 되는 것 아닌가?
    if (token) {
      createAxiosInstance(token)
      .get(`/api/videos/${video.id}/likedata`)
      .then((res) => {
        console.log("get like data", res.data);
        if (res.data.success) {
          setLikes(res.data.likes);
          setLiked(res.data.liked);
        }
      })
      .catch((err) => {
        console.error("/api/videos/likedata/:videoId", err);
      });
    }
  }, []);

  // 좋아요 버튼 클릭 이벤트 이거 프론트에서 막아야 할 것 같다.
  const onLike = (type) => {
    if (token) {
      createAxiosInstance(token)
      .post(`/api/videos/${video.id}/like`, { type })
      .then((res) => {
        setLikes(res.data.likes);
        setLiked(res.data.liked);
        setDisliked(res.data.disliked);
      })
      .catch((err) => {
        console.error("/api/videos/like/:videoId", err);
      });
    } else {
      alert("로그인을 해주세요.");
    }
  };
  return (
    <Wrapper liked={Liked} disliked={Disliked}>
      <button onClick={() => onLike("like")} id="like">
        {Liked ? <LikeOnIcon /> : <LikeOffIcon />}
        {Likes}
      </button>
      <button onClick={() => onLike("dislike")} id="dislike">
        {Disliked ? <DislikeOnIcon /> : <DislikeOffIcon />}
      </button>
    </Wrapper>
  );
}

export default LikeDislike;
