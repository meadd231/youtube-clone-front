import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StyledAuth } from "./Signup";
import useInput from "../hooks/useInput";
import { loginSuccess } from "../reducers/user";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { createAxiosInstance } from "../utils";

import { Link } from "react-router-dom";

/**
 * 1. local 로그인 뷰
 * 2. google 로그인 뷰
 * 3. local 로그인 핸들러
 * 4. google 로그인 핸들러
 * 5. 회원가입으로 버튼
 */
function Login() {
  const dispatch = useDispatch();

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

    const clearForm = () => {
      email.setValue("");
      password.setValue("");
    };

    console.log("payload", payload);
    clearForm();

    // payload는 req의 body 키로 전송된다.
    createAxiosInstance()
      .post("/api/auth/login", payload)
      .then((res) => {
        console.log("res", res);
        const token = res.data.token;
        // dispatch는 redux store에 액션을 전달한다.
        dispatch(loginSuccess(token));
      });

    // dispatch(login({ payload, clearForm }));
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
        console.log("token", res.data.token);
        dispatch(loginSuccess(res.data.token));
      })
      .catch((err) => {
        console.error("post api/auth/google-oauth", err);
      });
  };

  const clientId =
    "1068422300037-8dbd9nkbtoriimouhcta0091nmn3fc0i.apps.googleusercontent.com";

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
