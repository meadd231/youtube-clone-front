import React from "react";

import styled from "styled-components";
import { XIcon } from "./Icons";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  z-index: 1200;
  display: flex;
  position: absolute;
  #content {
    width: 450px;
    height: 600px;
    border: 1px solid black;
    background: white;
  }
  #header {
    display: flex;
  }
`;

function ChannelInfoModal({ setChannelInfoModalOpened }) {
  const { userData } = useSelector(state=>state.user);
  return (
    <Wrapper>
      <div id="content">
        <div id="header">
          <span style={{ flex: "1" }}>정보</span>
          <XIcon onClick={() => setChannelInfoModalOpened(false)} />
        </div>
        <div>{userData.channelDescription}</div>
        <div>채널 세부정보</div>
      </div>
    </Wrapper>
  );
}

export default ChannelInfoModal;
