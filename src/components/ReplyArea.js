import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Avatar, Button } from "antd";
import { Comment } from "@ant-design/compatible";

import CommentCard from "./CommentCard";

// utils
import useInput from "../hooks/useInput";
import { createAxiosInstance, relativeDate } from "../utils";

const Wrapper = styled.div``;

const ReplyArea = React.forwardRef(
  ({ parentComment, addReplyToComment, actions, replyInput, postReply }, ref) => {
    const [OpenReplyComments, setOpenReplyComments] = useState(false);
    const [ReplyComments, setReplyComments] = useState([]);
    const [firstCalled, setFirstCalled] = useState(false);

    // 답글을 추가하는 함수
    const addReply = (replyData) => {
      setReplyComments([...ReplyComments, replyData]);
    };

    // ReplyComment 컴포넌트 내에서 addReplyToComment 함수 호출
    // 이 함수를 통해 부모 컴포넌트의 addReplyToComment 함수가 호출됩니다.
    // addReplyToComment({
    //   addReply,
    //   // 다른 필요한 데이터도 전달 가능
    // });

    React.useImperativeHandle(ref, () => ({
      addReply,
    }));

    const { token } = useSelector((state) => state.user);

    const handleChange = () => {
      setOpenReplyComments(!OpenReplyComments);
      // 일단 한 번 하면 다시는 안 하게 돼 있긴하다.
      getReplies();
    };

    const getReplies = () => {
      if (!firstCalled) {
        createAxiosInstance(token)
          .get(`/api/comments/${parentComment.id}/replies`)
          .then((res) => {
            if (res.data.success) {
              setReplyComments(res.data.comments);
              console.log("get /api/comments/reply", res.data);
            } else {
              alert("답글 조회 실패");
            }
          })
          .catch((err) => {
            console.error(err);
          });
        setFirstCalled(true);
      }
    };

    let renderReplyComment = (parentCommentId) => {
      return ReplyComments.map(
        (comment, index) =>
          comment.commentId === parentCommentId && (
            <CommentCard
              key={comment.id}
              comment={comment}
              postReply={postReply}
              replyToCommentId={parentComment.id}
              commentType="reply"
            />
          )
      );
    };
    return (
      <Wrapper>
        {parentComment.replyNum > 0 && (
          <Button
            style={{ fontSize: "14px", margin: 0, color: "blue" }}
            onClick={handleChange}
            type="text"
          >
            {OpenReplyComments ? "▲ " : "▼ "}
            답글 {parentComment.replyNum}개
          </Button>
        )}

        {OpenReplyComments && renderReplyComment(parentComment.id)}
      </Wrapper>
    );
  }
);

export default ReplyArea;
