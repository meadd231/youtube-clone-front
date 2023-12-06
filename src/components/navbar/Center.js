import React from "react";
import styled from "styled-components";

import { Tooltip } from "antd";
import { MicIcon } from "../Icons";

function Center() {
  return (
    <div className="center">
      <div className="search-container">
        <input
          className="search-box"
          type="text"
          placeholder="검색"
          // value={searchterm.value}
          // onKeyDown={handleSearch}
          // onChange={searchterm.onChange}
        />
        <Tooltip placement="bottom" title={"검색"} arrow={false}>
          <button className="search-button">검색</button>
        </Tooltip>
      </div>
      <Tooltip placement="bottom" title={"음성으로 검색"} arrow={false}>
        <MicIcon
          className="mic-btn"
          onClick={() => {
            alert("구현 예정입니다.");
          }}
        />
      </Tooltip>
    </div>
  );
}

export default Center;
