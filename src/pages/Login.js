import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StyledAuth } from "./Signup";
import useInput from "../hooks/useInput";
import { login } from "../reducers/user";

import { Link } from "react-router-dom";
import axios from "axios";

const loginSuccess = (token) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: { token },
  };
};

const logout = () => {
  return {
    type: 'LOGOUT',
  };
};

const Login = () => {
  const dispatch = useDispatch();

  const email = useInput("");
  const password = useInput("");

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

    console.log('payload', payload);
    clearForm();

    // payload는 req의 body 키로 전송된다.
    axios.post('http://localhost:3001/api/login', payload)
    .then((res) => {
      console.log('res', res);
      const token = res.data.token;
      // 지연처리를 말하는 건가? dispatch를 하면 이 작업이 끝난 뒤에 프론트 UI의 갱신이라던가 그런 게 발생하도록 하는 그런 거 같은데?
      // dispatch는 redux store에 액션을 전달한다.
      dispatch(loginSuccess(token));
    })

    // dispatch(login({ payload, clearForm }));
  };

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
