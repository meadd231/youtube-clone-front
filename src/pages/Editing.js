import React, { useEffect } from "react";
import styled from "styled-components";

import { Tabs } from "antd";

import Images from "../components/editing/Images";
import Details from "../components/editing/Details";
import { createAxiosInstance } from "../utils";

const Wrapper = styled.div`
  .customFileInput,
  #delete-btn {
    display: inline-block;
    padding: 10px;
    height: 25px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  #profile-img {
    width: 200px;
    height: 200px;
  }
`;

function Editing() {

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "브랜딩",
      children: <Images />,
    },
    {
      key: "2",
      label: "기본 정보",
      children: <Details />,
    },
  ];

  return (
    <Wrapper>
      <div>채널 맞춤설정</div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Wrapper>
  );
}

export default Editing;
