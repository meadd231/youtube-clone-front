import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     data: JSON.parse(localStorage.getItem("user")) || {},
//   },
//   reducers: {
//     addChannel(state, action) {
//       state.data = {
//         ...state.data,
//         channels: [action.payload, ...state.data.channels],
//       };
//     },
//     removeChannel(state, action) {
//       state.data = {
//         ...state.data,
//         channels: state.data.channels.filter(
//           (channel) => channel.id !== action.payload
//         ),
//       };
//     },
//     updateUser(state, action) {
//       state.data = {
//         ...state.data,
//         ...action.payload,
//       };
//     },
//     logout(state, action) {
//       state.data = {};
//     },
//   },
//   extraReducers: {
//     [login.fulfilled]: (state, action) => {
//       state.data = action.payload || {};
//     },
//     [signup.fulfilled]: (state, action) => {
//       state.data = action.payload || {};
//     },
//   },
// });

// export const { addChannel, removeChannel, updateUser, logout } =
//   userSlice.actions;

// export default userSlice.reducer;

const initialState = {
  token: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};
