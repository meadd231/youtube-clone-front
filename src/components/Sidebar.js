import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  display: inline;
  height: 100%;

  .sidebar {
    width: 240px;
    background-color: #333;
    color: #fff;
    padding: 20px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    margin-bottom: 10px;
  }

  .sidebar a {
    color: #fff;
    text-decoration: none;
  }

  .content {
    flex: 1;
    padding: 20px;
  }
`;

function Sidebar() {
  console.log('sidebar');
  return (
    <Wrapper>
      <div className="sidebar">
        <ul>
          <li>
            <a href="">홈</a>
          </li>
          <li>
            <a href="#">Shorts</a>
          </li>
          <li>
            <a href="#">구독</a>
          </li>
          <br />
          <li>
            <a href="#">보관함</a>
          </li>
          <br />
          <li>구독</li>
          <br />
          <li>탐색</li>
          <br />
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
