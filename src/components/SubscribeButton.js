import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { createAxiosInstance } from "../utils";

const Wrapper = styled.div`
  #subscribe-button {
    background-color: ${(props) => (props.subscribed ? "#e5e5e5" : "#0f0f0f")};
    border-radius: 18px;
    color: ${(props) => (props.subscribed ? "black" : "white")};
    padding: 0 16px;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    text-transform: uppercase;
  }
`;

function SubscribeButton({ channelId, SubscribeNumber, setSubscribeNumber }) {
  const [Subscribed, setSubscribed] = useState(false);
  const { token } = useSelector((state) => state.user);
  
  const onSubscribe = () => {
    if (token) {
      createAxiosInstance(token)
        .post("/api/subscribes/subscribe", { writer: channelId })
        .then((res) => {
          console.log(res.data);
          if (res.data.type === "subscribe") {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(true);
          } else if (res.data.type === "cancel") {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(false);
          }
        });
    }
  };

  useEffect(() => {
    if (token) {
      createAxiosInstance(token)
        .get(`/api/subscribes/${channelId}/subscribed`)
        .then((res) => {
          if (res.data.success) {
            console.log("get /api/subscribes/:channelId/subscribed", res.data);
            setSubscribed(res.data.subscribed);
          } else {
            alert("Failed to get Subscribed Information");
          }
        });
    }
  }, []);
  return (
    <Wrapper subscribed={Subscribed}>
      <button id="subscribe-button" onClick={onSubscribe}>
        {Subscribed ? "구독중" : "구독"}
      </button>
    </Wrapper>
  );
}

export default SubscribeButton;
