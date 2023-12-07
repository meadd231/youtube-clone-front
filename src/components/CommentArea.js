import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Avatar, Button, Dropdown, Menu } from "antd";

// components
import CommentView from "./CommentView";
import ReplyComment from "./ReplyArea";

// utils
import useInput from "../hooks/useInput";
import { createAxiosInstance } from "../utils";

const Wrapper = styled.div`
  .comment-btn {
    display: ${(props) => (props.commentClicked ? "inline" : "none")};
  }

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

function CommentArea({ video }) {
  const [CommentClicked, setCommentClicked] = useState(false);
  const commentClick = () => {
    if (CommentClicked) {
      comment.setValue("");
    }
    setCommentClicked(!CommentClicked);
  };

  // 0 - 인기, 1 - 최신
  const [Sortby, setSortby] = useState(0);
  const [CommentCount, setCommentCount] = useState(0);

  const comment = useInput("");
  const [Comments, setComments] = useState();

  const { token, userData } = useSelector((state) => state.user);

  useEffect(() => {
    const axiosInstance = createAxiosInstance(token);
    axiosInstance
      .get(`/api/comments/${video.id}`)
      .then((res) => {
        if (res.data.success) {
          console.log("get /api/comments", res.data);
          setComments(res.data.comments);
        } else {
          alert("댓글 조회 실패");
        }
      })
      .catch((err) => {
        console.error("get /api/comments", err);
      });

    axiosInstance
      .get(`/api/comments/count/${video.id}`)
      .then((res) => {
        if (res.data.success) {
          console.log("get /api/comments/count", res.data);
          setCommentCount(res.data.commentCount);
        }
      })
      .catch((err) => {
        console.error("get /api/comments/count", err);
      });
  }, [Sortby]);

  const handleSortby = (option) => {
    setSortby(option);
    // 여기에다가 axios에서 가져오는 코드를 만든다?
    // setComments() 이걸 해 놓으면 새로 바뀌는 걸까?
  };

  const selectedStyle = {
    style: { backgroundColor: "gray" },
  };

  const items = [
    {
      label: (
        <div
          {...(Sortby === 0 && selectedStyle)}
          onClick={() => {
            handleSortby(0);
          }}
        >
          인기 댓글순
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div
          {...(Sortby === 1 && selectedStyle)}
          onClick={() => {
            handleSortby(1);
          }}
        >
          최신순
        </div>
      ),
      key: "1",
    },
  ];

  const postComment = () => {
    createAxiosInstance(token)
      .post("/api/comments/comment", { content: comment.value, videoId: video.id })
      .then((res) => {
        comment.setValue("");
        console.log("post /api/comments/comment", res.data.comment);
        setComments([res.data.comment, ...Comments]);
      })
      .catch((err) => {
        console.error("post /api/comments/comment", err);
      });
  };
  return (
    <Wrapper commentClicked={CommentClicked}>
      <div>
        <span
          style={{ fontSize: "20px", lineHeight: "2.8rem", fontWeight: "700" }}
        >
          댓글 {CommentCount}개
        </span>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
          trigger={["click"]}
        >
          <Button type="text">정렬기준</Button>
        </Dropdown>
        <div style={{ display: "flex" }}>
          <Avatar src={!userData ? "": `${process.env.REACT_APP_SERVER_URL}/uploads/avatars/${userData.avatar}`} style={{ verticalAlign: "middle" }} size="large" gap={0}>
            {!userData ? "" : userData.nickname}
          </Avatar>
          <input
            className="comment-area"
            {...(CommentClicked ? {} : { onClick: commentClick })}
            placeholder="댓글 추가..."
            onChange={comment.onChange}
            style={{ width: "100%" }}
            value={comment.value}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button className="comment-btn" onClick={commentClick} type="text">
            취소
          </Button>
          <Button
            className="comment-btn"
            onClick={postComment}
            {...(comment.value.length > 0 ? { type: "primary" } : {})}
            disabled={comment.value.length === 0}
          >
            댓글
          </Button>
        </div>
      </div>
      <div>
        {Comments &&
          Comments.map(
            (comment, index) =>
              !comment.commentId && (
                <CommentView
                  comment={comment}
                  key={comment.id}
                  // refreshFunction={props.refreshFunction}
                />
              )
          )}
      </div>
    </Wrapper>
  );
}

export default CommentArea;
