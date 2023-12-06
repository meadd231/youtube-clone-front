import React from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  display: inline;
  ${({ open }) =>
    !open &&
    css`
      display: none;
    `}

  .sidebar {
    width: 200px;
    background-color: #fff;
    color: #000;
    padding-left: 20px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    margin-bottom: 10px;
  }

  .sidebar a {
    color: #000;
    text-decoration: none;
  }

  .content {
    flex: 1;
    padding: 20px;
  }

  .horizontal-line {
    border-top: 1px solid #ccc; /* 가로선 스타일을 지정하세요 */
    width: 100%; /* 가로선의 너비를 지정하세요 */
  }
`;

function Sidebar() {
  console.log("sidebar");
  const { open } = useSelector((state) => state.sidebar);
  return (
    <Wrapper open={open}>
      <div className="sidebar">
        <ul>
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/">Shorts</a>
          </li>
          <li>
            <a href="/">구독</a>
          </li>
          <div class="horizontal-line"></div>
          <li>
            <a href="/">보관함</a>
          </li>
          <div class="horizontal-line"></div>
          <li>구독</li>
          <br />
          <div class="horizontal-line"></div>
          <li>탐색</li>
          <br />
          <div class="horizontal-line"></div>
          <li>설정</li>
          <li>신고 기록</li>
          <li>고객센터</li>
          <li>의견 보내기</li>
        </ul>
      </div>
    </Wrapper>
  );
}

export default Sidebar;
