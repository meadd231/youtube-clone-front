import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";

const Wrapper = styled.div`
  width: 300px;
  height: 759px;

  z-index: 1000;

  position: fixed;
  top: 45px;
  right: 20px;

  background: white;
  border: 1px solid black;
  border-radius: 8px;
`;

function UserModal({ closeUserModal }) {
  // 모달 외부 클릭 시 끄기 처리 용도
  // Modal 창을 useRef로 취득
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const logoutEvent = () => {
    dispatch(logout());
    closeUserModal();

    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  useEffect(() => {
    const removeUserModal = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeUserModal();
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", removeUserModal);
    // document.addEventListener('touchstart', handler); // 모바일 대응

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", removeUserModal);
      // document.removeEventListener('touchstart', handler); // 모바일 대응
    };
  });
  return (
    <Wrapper ref={modalRef}>
      <div>
        <a href={`/channel/${userData.nickname}/featured`}>내 채널 보기</a>
      </div>
      <div>
        <Link to={"studio/editing"}>프로필 기능</Link>
      </div>
      <div onClick={logoutEvent}>로그아웃</div>
      <div>테마</div>
      <div>설정</div>
      <div>고객센터</div>
    </Wrapper>
  );
}

export default UserModal;
