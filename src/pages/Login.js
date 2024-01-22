import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StyledAuth } from "./Signup";
import useInput from "../hooks/useInput";
import { loginSuccess } from "../reducers/user";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { createAxiosInstance } from "../utils";

import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * 1. local 로그인 뷰
 * 2. google 로그인 뷰
 * 3. local 로그인 핸들러
 * 4. google 로그인 핸들러
 * 5. 회원가입으로 버튼
 */
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = useInput("");
  const password = useInput("");

  // 로그인 핸들러
  const handleLogin = () => {
    if (!email.value.trim() || !password.value.trim()) {
      return toast.error("Please fill in all the fields");
    }

    const payload = {
      email: email.value,
      password: password.value,
    };

    // payload는 req의 body 키로 전송된다.
    createAxiosInstance('', false)
      .post("/api/auth/login", payload)
      .then((res) => {
        console.log("res", res);
        const tokens = res.data.tokens;
        // dispatch는 redux store에 액션을 전달한다.
        dispatch(loginSuccess(tokens));
        console.log('로그인 location', location);
        navigate(location.state ? location.state.prev : '/');
      }).catch(error => {
        console.error("post login", error);
      });
  };

  /**
   * google 로그인 핸들러
   */
  const googleLogin = (res) => {
    const credential = res.credential;
    createAxiosInstance()
      .post("/api/auth/google-oauth", {
        credential,
      })
      .then((res) => {
        console.log("post api/auth/google-oauth", res);
        const tokens = res.data.tokens;
        console.log("tokens", tokens);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        dispatch(loginSuccess(tokens));
      })
      .catch((err) => {
        console.error("post api/auth/google-oauth", err);
      });
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <StyledAuth>
      <h2>로그인</h2>
        <input
          type="email"
          placeholder="email"
          value={email.value}
          onChange={email.onChange}
        />
        <input
          type="password"
          placeholder="password"
          value={password.value}
          onChange={password.onChange}
        />
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={googleLogin}
            onFailure={(err) => {
              console.log(err);
            }}
          />
        </GoogleOAuthProvider>
        <div className="action input-group">
          <Link to={"/signup"}>
            <button>회원가입</button>
          </Link>
          <button onClick={handleLogin}>로그인</button>
        </div>
    </StyledAuth>
  );
}

export default Login;
