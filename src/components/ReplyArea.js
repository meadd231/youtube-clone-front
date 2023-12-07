import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "antd";

import CommentCard from "./CommentCard";
import LoadingSpinner from "./LoadingSpinner";

// utils
import { createAxiosInstance } from "../utils";


function ReplyArea({ parentComment, addReplyToComment, Replies, setReplies }) {
  const [Loading, setLoading] = useState(false);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);
  const [FirstCalled, setFirstCalled] = useState(false);

  const { token } = useSelector((state) => state.user);

  const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
    // 일단 한 번 하면 다시는 호출 안 되게 함.
    getReplies();
  };

  const getReplies = () => {
    if (!FirstCalled) {
      setLoading(true);
      createAxiosInstance(token)
        .get(`/api/comments/${parentComment.id}/replies`)
        .then((res) => {
          if (res.data.success) {
            setReplies(res.data.comments);
            console.log("get /api/comments/reply", res.data);
          } else {
            alert("답글 조회 실패");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
      setFirstCalled(true);
    }
  };

  let renderReplyComment = (parentCommentId) => {
    return Replies.map(
      (comment) =>
        comment.commentId === parentCommentId && (
          <CommentCard
            key={comment.id}
            comment={comment}
            replyToCommentId={parentComment.id}
            addReplyToComment={addReplyToComment}
          />
        )
    );
  };
  return (
    <>
      {(parentComment.replyNum > 0) && (
        <Button
          style={{ fontSize: "14px", margin: 0, color: "blue" }}
          onClick={handleChange}
          type="text"
        >
          {OpenReplyComments ? "▲ " : "▼ "}
          답글 {parentComment.replyNum}개
        </Button>
      )}
      {Loading && <LoadingSpinner />}

      {OpenReplyComments && renderReplyComment(parentComment.id)}
    </>
  );
}
export default ReplyArea;
