import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  width: 240px;
  height: 60px;

  z-index: 999;

  /* 중앙 배치 */
  /* top, bottom, left, right 는 브라우저 기준으로 작동한다. */
  /* translate는 본인의 크기 기준으로 작동한다. */
  position: absolute;
  top: 40px;
  right: 80px;

  background: white;
  border: 1px solid black;
  border-radius: 8px;
`;

function UploadModal({ closeUploadModal }) {
  // 모달 끄기 (X버튼 onClick 이벤트 핸들러)

  // 모달 외부 클릭시 끄기 처리
  // Modal 창을 useRef로 취득
  const modalRef = useRef(null);

  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeUploadModal();
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", handler);
    // document.addEventListener('touchstart', handler); // 모바일 대응

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", handler);
      // document.removeEventListener('touchstart', handler); // 모바일 대응
    };
  });
  return (
    <Wrapper ref={modalRef}>
      <Link to={"/video/upload"}>
        <div>동영상 업로드</div>
      </Link>
      <div>라이브 스트리밍 시작</div>
    </Wrapper>
  );
}

export default UploadModal;
