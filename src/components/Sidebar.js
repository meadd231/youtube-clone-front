import React from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";

import { useLocation } from "react-router-dom";

import {
  HomeOffIcon,
  HomeOnIcon,
  ShortsOffIcon,
  ShortsOnIcon,
  SubOffIcon,
  SubOnIcons,
  SettingIcon,
  ReportIcon,
  HelpCenterIcon,
  FeedBackIcon,
} from "./Icons";

import { Button } from "antd";

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
    width: 216px;
    background-color: #fff;
    color: #000;
    padding-left: 20px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    height: 40px;
    margin-bottom: 10px;
  }

  .sidebar a {
    color: #000;
    text-decoration: none;
  }

  .sidebar-item {
    width: 100%;
    display: flex;
    justify-content: left;
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
  const location = useLocation();
  console.log("location", location);
  return (
    <Wrapper open={open}>
      <div className="sidebar">
        <ul>
          <li>
            <a href="/">
              <Button type="text" className="sidebar-item">
                {location.pathname === "/" ? <HomeOnIcon /> : <HomeOffIcon />}
                <span style={{ marginLeft: "10px" }}>홈</span>
              </Button>
            </a>
          </li>
          <li>
            <a href="/shorts">
              <Button type="text" className="sidebar-item">
                {location.pathname.startsWith("/shorts") ? (
                  <ShortsOnIcon />
                ) : (
                  <ShortsOffIcon />
                )}
                <span style={{ marginLeft: "10px" }}>Shorts</span>
              </Button>
            </a>
          </li>
          <li>
            <a href="/feed/subscriptions">
              <Button type="text" className="sidebar-item">
                {location.pathname === "/feed/subscriptions" ? (
                  <SubOnIcons />
                ) : (
                  <SubOffIcon />
                )}
                <span style={{ marginLeft: "10px" }}>구독</span>
              </Button>
            </a>
          </li>
          <div class="horizontal-line"></div>
          <li>
            <a href="/">보관함</a>
          </li>
          <div class="horizontal-line"></div>
          <li><span>구독</span></li>
          <div class="horizontal-line"></div>
          <li><span>탐색</span></li>
          <div class="horizontal-line"></div>
          <li>
            <a href="/">
              <Button type="text" className="sidebar-item">
                <SettingIcon />
                <span style={{ marginLeft: "10px" }}>설정</span>
              </Button>
            </a>
          </li>
          <li>
            <a href="/">
              <Button type="text" className="sidebar-item">
                <ReportIcon />
                <span style={{ marginLeft: "10px" }}>신고 기록</span>
              </Button>
            </a>
          </li>
          <li>
            <a href="/">
              <Button type="text" className="sidebar-item">
                <HelpCenterIcon />
                <span style={{ marginLeft: "10px" }}>고객센터</span>
              </Button>
            </a>
          </li>
          <li>
            <a href="/">
              <Button type="text" className="sidebar-item">
                <FeedBackIcon />
                <span style={{ marginLeft: "10px" }}>의견 보내기</span>
              </Button>
            </a>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
}

export default Sidebar;
