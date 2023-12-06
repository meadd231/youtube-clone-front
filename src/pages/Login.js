import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StyledAuth } from "./Signup";
import useInput from "../hooks/useInput";
import { loginSuccess } from "../reducers/user";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Link } from "react-router-dom";
import axios from "axios";

const logout = () => {
  return {
    type: "LOGOUT",
  };
};

const Login = () => {
  const dispatch = useDispatch();

  const email = useInput("");
  const password = useInput("");

  const googleLogin = (res) => {
    const credential = res.credential;
    axios
      .post("http://localhost:3001/api/auth/google-oauth", {
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

  // 이벤트 핸들러
  const handleLogin = (e) => {
    e.preventDefault();

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
    axios.post("http://localhost:3001/api/auth/login", payload).then((res) => {
      console.log("res", res);
      const token = res.data.token;
      // dispatch는 redux store에 액션을 전달한다.
      dispatch(loginSuccess(token));
    });

    // dispatch(login({ payload, clearForm }));
  };
  const clientId =
    "1068422300037-8dbd9nkbtoriimouhcta0091nmn3fc0i.apps.googleusercontent.com";

  return (
    <StyledAuth>
      <h2>Login to your account</h2>
      <form onSubmit={handleLogin}>
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
            <button>Signup instead</button>
          </Link>
          <button>Login</button>
        </div>
      </form>
    </StyledAuth>
  );
};

export default Login;
