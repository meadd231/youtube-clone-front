import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { createAxiosInstance } from "../../utils";

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

  const [Replies, setReplies] = useState([]);

  const addReplyToComment = (replyData) => {
    setReplies([...Replies, replyData]);
  };

  return (
    <Wrapper>
      <CommentCard
        comment={comment}
        replyToCommentId={comment.id}
        addReplyToComment={addReplyToComment}
      >
        <ReplyArea
          parentComment={comment}
          addReplyToComment={addReplyToComment}
          Replies={Replies}
          setReplies={setReplies}
        />
      </CommentCard>
    </Wrapper>
  );
}

export default CommentView;
