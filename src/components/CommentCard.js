import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";

import { Avatar, Button } from "antd";
import { Comment } from "@ant-design/compatible";
import {
  LikeOffIcon,
  LikeOnIcon,
  DislikeOffIcon,
  DislikeOnIcon,
} from "./Icons";

import { relativeDate, createAxiosInstance } from "../utils";
import useInput from "../hooks/useInput";

// 여기 내부에 좋아요, 답글 버튼도 있어야 하긴 할 것 같거든요.
function CommentCard({
  comment,
  postReply,
  replyToCommentId,
  commentType,
  children,
}) {
  const [Liked, setLiked] = useState(comment.liked);
  const [Likes, setLikes] = useState(comment.likes);
  const [Disliked, setDisliked] = useState(comment.disliked);
  // 여기에다가 state로 관리할까? 아니면 뭘로 관리해? state가 낫지 않을까? 댓글 전체가 바뀌는 건 아닐텐데.
  const [ReplyInputOpened, setReplyInputOpened] = useState(false);
  const openReply = () => {
    setReplyInputOpened(!ReplyInputOpened);
  };
  const replyInput = useInput("");

  const { token } = useSelector((state) => state.user);

  const postCommentLike = (type) => {
    const commentId = commentType === "comment" ? replyToCommentId : comment.id;
    createAxiosInstance(token)
      .post(`/api/comments/${commentId}/like`, { type })
      .then((res) => {
        if (res.data.success) {
          console.log("post /api/comments/like", res.data);
          setLikes(res.data.likes);
          setLiked(res.data.liked);
          setDisliked(res.data.disliked);
        } else {
          alert("좋아요 실패");
        }
      })
      .catch((err) => {
        console.error("post /api/comments/like", err);
      });
  };

  const replyInputView = ReplyInputOpened && (
    <>
      <input
        className="comment-area"
        style={{ width: "100%", borderRadius: "5px" }}
        onChange={replyInput.onChange}
        value={replyInput.value}
        placeholder="답글 추가..."
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() => {
            openReply(replyInput);
          }}
          type="text"
        >
          취소
        </Button>
        <Button
          onClick={() => {
            postReply(replyInput);
          }}
          {...(replyInput.value.length > 0 ? { type: "primary" } : {})}
          disabled={replyInput.value.length === 0}
        >
          답글
        </Button>
      </div>
    </>
  );

  const actions = [
    <span
      onClick={() => {
        postCommentLike("like");
      }}
    >
      {Liked ? <LikeOnIcon /> : <LikeOffIcon />}
    </span>,
    Likes > 0 && <span key="likes-count">{Likes}</span>,
    <span
      onClick={() => {
        postCommentLike("dislike");
      }}
    >
      {Disliked ? <DislikeOnIcon /> : <DislikeOffIcon />}
    </span>,
    <Button onClick={openReply} key="comment-basic-reply-to" type="text">
      답글
    </Button>,
  ];
  return (
    <Comment
      actions={actions}
      author={comment.User.nickname}
      avatar={
        <Avatar
          src={`http://localhost:3001/uploads/avatars/${comment.User.avatar}`}
          size="large"
          gap={0}
        >
          {comment.User.nickname}
        </Avatar>
      }
      datetime={relativeDate(comment.createdAt)}
      content={<p>{comment.content}</p>}
    >
      {replyInputView}
      {children}
    </Comment>
  );
}

export default CommentCard;
