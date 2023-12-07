import React, { useState } from "react";
import { useSelector } from "react-redux";

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
import { ClipLoader } from "react-spinners";
import LoadingSpinner from "./LoadingSpinner";

function CommentCard({
  comment,
  replyToCommentId,
  addReplyToComment,
  children,
}) {
  const [Liked, setLiked] = useState(comment.liked);
  const [Likes, setLikes] = useState(comment.likes);
  const [Disliked, setDisliked] = useState(comment.disliked);
  const [Loading, setLoading] = useState(false);
  const [ReplyInputOpened, setReplyInputOpened] = useState(false);
  const openReply = () => {
    setReplyInputOpened(!ReplyInputOpened);
  };
  const replyInput = useInput("");

  const { token } = useSelector((state) => state.user);

  const postReply = () => {
    const reqBody = {
      videoId: comment.videoId,
      commentId: replyToCommentId,
      content: replyInput.value,
    };

    setLoading(true);
    createAxiosInstance(token)
      .post("/api/comments/replies/reply", reqBody)
      .then((res) => {
        if (res.data.success) {
          console.log("post /api/comments/reply", res.data);
          replyInput.setValue("");
          setReplyInputOpened(false);
          addReplyToComment(res.data.reply);
        } else {
          alert("답글 작성 실패");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("/api/comments/replies/reply", err);
        setLoading(false);
      });
  };

  const postCommentLike = (type) => {
    createAxiosInstance(token)
      .post(`/api/comments/${comment.id}/like`, { type })
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

  const replyInputView = ReplyInputOpened && !Loading && (
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
          onClick={postReply}
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
          src={`${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${comment.User.avatar}`}
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
      {Loading && <LoadingSpinner />}
      {children}
    </Comment>
  );
}

export default CommentCard;
