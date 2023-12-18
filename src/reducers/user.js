import { createAsyncThunk } from "@reduxjs/toolkit";
import { authenticate } from "../utils";

// 이게 뭘까? login reducder 함수가 있네.
// return user인데 reducedr에서 return을 하면 뭐가 어떻게 되는 거지? 그리고 login하고 signup이 같은 코드인데?
export const login = createAsyncThunk(
  "user/login",
  async ({ payload, clearForm }) => {
    const user = await authenticate("login", payload);

    if (user.token) {
      clearForm();
      return user;
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async ({ payload, clearForm }) => {
    const user = await authenticate("signup", payload);

    if (user.token) {
      clearForm();
      return user;
    }
  }
);

const initialState = {
  token: null,
};

export const loginSuccess = (token) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: { token },
  };
};

export const logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const avatarChange = (avatar) => {
  return {
    type: "AVATAR_CHANGE",
    payload: { avatar },
  };
};

export const channelDescriptionChange = (channelDescription) => {
  return {
    type: "DESCRIPTION_CHANGE",
    payload: { channelDescription },
  };
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      const payload = action.payload.token.split(".")[1]; // [header, payload, signature]로 분리된다.
      // Base64 디코딩 후 JSON 파싱
      let decodedPayload = {};
      try {
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        decodedPayload = JSON.parse(
          decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          )
        );
        console.log("Decoded Payload:", decodedPayload);
      } catch (error) {
        console.error("디코딩 에러", error);
      }
      return {
        ...state,
        token: action.payload.token,
        userData: { ...decodedPayload },
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
      };
    case "AVATAR_CHANGE":
      return {
        ...state,
        userData: { ...state.userData, avatar: action.payload.avatar },
      };
    case "DESCRIPTION_CHANGE":
      return {
        ...state,
        userData: {
          ...state.userData,
          channelDescription: action.payload.channelDescription,
        },
      };
    default:
      return state;
  }
}
