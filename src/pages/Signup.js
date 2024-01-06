import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signupSuccess } from "../reducers/user";

import { createAxiosInstance } from "../utils";

export const StyledAuth = styled.div`
  width: 385px;
  padding: 3rem 1.5rem;
  background: ${(props) => props.theme.grey};
  border-radius: 4px;
  margin: 8% auto;

  h2 {
    margin-bottom: 1.3rem;
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .input-group input:last-child {
    margin-left: 0.7rem;
  }

  input {
    overflow: hidden;
    border-radius: 3px;
    width: 100%;
    padding: 0.6rem 1.2rem;
    background: ${(props) => props.theme.black};
    border: 1px solid ${(props) => props.theme.black};
    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.primaryColor};
  }

  .action {
    margin-top: 1rem;
  }

  button {
    padding: 0.4rem 1rem;
    background: ${(props) => props.theme.red};
    color: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.red};
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 1.1px;
  }

  span {
    letter-spacing: 0.8px;
    color: ${(props) => props.theme.secondaryColor};
  }

  @media screen and (max-width: 430px) {
    margin: 20% auto;
    width: 90%;
  }
`;

/**
 * 1. local 회원가입 뷰
 * 2. local 회원가입 핸들러
 */
const Signup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const username = useInput("");
  const email = useInput("");
  const password1 = useInput("");
  const password2 = useInput("");

  /**
   * 회원가입 요청 후 화면 이동
   * 1. 유효성 검사
   * 2.
   */
  const signup = () => {
    if (
      !username.value.trim() ||
      !email.value.trim() ||
      !password1.value.trim() ||
      !password2.value.trim()
    ) {
      return toast.error("Please fill in all the fields");
    }

    if (password1.value !== password2.value) {
      return toast.error("Password does not match");
    }

    if (username.value.length <= 3) {
      return toast.error("Username should be atleast four characters long");
    }

    const re = /^[a-z0-9\x20]+$/i;
    if (!re.exec(username.value)) {
      return toast.error("Choose a better username");
    }

    const payload = {
      username: username.value,
      email: email.value,
      password: password1.value,
    };

    createAxiosInstance("", false)
      .post("/api/auth/signup", payload)
      .then((res) => {
        console.log("res", res);
        const tokens = res.data.tokens;
        dispatch(signupSuccess(tokens));
        navigate(location.state ? location.state.prev : "/");
      })
      .catch((error) => {
        console.error("post login", error);
      });
  };

  /**
   * 1. input들
   * 2. button들
   */
  return (
    <StyledAuth>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="username"
        value={username.value}
        onChange={username.onChange}
      />
      <input
        type="email"
        placeholder="email"
        value={email.value}
        onChange={email.onChange}
      />
      <input
        type="password"
        placeholder="password"
        value={password1.value}
        onChange={password1.onChange}
      />
      <input
        type="password"
        placeholder="confirm"
        value={password2.value}
        onChange={password2.onChange}
      />
      <div className="action input-group">
        <Link to={"/login"}>
          <button>로그인으로 가기</button>
        </Link>
        <button onClick={signup}>회원가입</button>
      </div>
    </StyledAuth>
  );
};

export default Signup;
