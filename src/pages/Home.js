import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  flex: 1;
  margin: 0 16px;

  .grid-item {
    background-color: #f0f0f0;
    padding: 20px;
    height: 180px;
  }
`;

function Home() {
  return (
    <Wrapper>
      <div class="grid-item">동영상 1</div>
      <div class="grid-item">동영상 2</div>
      <div class="grid-item">동영상 3</div>
      <div class="grid-item">동영상 1</div>
      <div class="grid-item">동영상 2</div>
      <div class="grid-item">동영상 3</div>
      <div class="grid-item">동영상 1</div>
      <div class="grid-item">동영상 2</div>
      <div class="grid-item">동영상 3</div>
    </Wrapper>
  );
}

export default Home;
