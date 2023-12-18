import React, { useEffect, useState } from "react";

import { Input, Button } from "antd";
import useInput from "../../hooks/useInput";
import LoadingSpinner from "../LoadingSpinner";
import { createAxiosInstance } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { channelDescriptionChange } from "../../reducers/user";
const { TextArea } = Input;

function Details() {
  const { token, userData } = useSelector((state) => state.user);
  const description = useInput(userData.channelDescription);
  const [ProtoDescription, setProtoDescription] = useState(userData.channelDescription);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const putDescription = () => {
    setLoading(true);
    createAxiosInstance(token)
      .put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/user/description`,
        { description: description.value }
      )
      .then((res) => {
        if (res.data.success) {
          dispatch(channelDescriptionChange(description.value));
          setProtoDescription(description.value);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  return (
    <div style={{ width: "900px" }}>
      <div>설명</div>
      <TextArea
        onChange={description.onChange}
        value={description.value}
        placeholder="시청자에게 채널에 대해 설명해 주세요. 이 설명은 채널의 정보 섹션 및 검색결과 등에 표시됩니다."
        autoSize
      />
      <Button
        disabled={ProtoDescription === description.value}
        onClick={putDescription}
      >
        게시
      </Button>
      {Loading && <LoadingSpinner />}
    </div>
  );
}

export default Details;
