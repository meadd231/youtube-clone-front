import React, { useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { createAxiosInstance } from "../utils";

import ReplyArea from "./ReplyArea";
import CommentCard from "./CommentCard";


const Wrapper = styled.div`
  .comment-area {
    border: none;
    border-bottom: 1px solid #ccc;
    transition: border-bottom-color 0.3s;
  }

  .comment-area:focus {
    outline: none;
    border-color: #000;
  }
`;

// 여기에서 Comment와 Replies를 밑에 컴포넌트들로 내려 보내주는 역할을 해야 할 수도 있겠다는 생각이 들었다. 그게 나을 것 같은데?
function CommentView({ comment }) {
  const { token } = useSelector((state) => state.user);
  // useRef를 사용하여 ReplyComment 컴포넌트의 인스턴스에 접근하는 ref 생성
  const replyCommentRef = useRef();
  const postReply = (input) => {
    const reqBody = {
      videoId: comment.videoId,
      commentId: comment.id,
      content: input.value,
    };

    console.log('input에 뭐가 들어있을까?', reqBody);

    createAxiosInstance(token)
      .post("/api/comments/replies/reply", reqBody)
      .then((res) => {
        if (res.data.success) {
          input.setValue("");
          // props.refreshFunction(response.data.result); UI 초기화를 해줘야 한다는 것 같네요.
          // ReplyComment 컴포넌트에 값을 전달하는 함수 호출
          console.log('post /api/comments/reply', res.data);
          addReplyToComment(res.data.reply);
        } else {
          alert("Failed to save Comment");
        }
      });
  };

  // ReplyComment 컴포넌트에 값을 전달하는 함수
  const addReplyToComment = (replyData) => {
    console.log("replyCommentRef", replyCommentRef);
    console.log("replyCommentRef.current", replyCommentRef.current);
    // ReplyComment 컴포넌트 내에서 addReply 함수 호출
    replyCommentRef.current.addReply(replyData);
  };

  return (
    <Wrapper>
      <CommentCard
        comment={comment}
        postReply={postReply}
        replyToCommentId={comment.id}
        commentType="comment"
      >
        <ReplyArea
          parentComment={comment}
          addReplyToComment={addReplyToComment}
          ref={replyCommentRef}
          postReply={postReply}
        />
      </CommentCard>
    </Wrapper>
  );
}

export default CommentView;
