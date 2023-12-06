import { combineReducers } from "redux";

// reducers
import user from "./user";
// import feed from "./feed";
// import video from "./video";
// import profile from "./profile";
import sidebar from "./sidebar";
// import recommendation from "./recommendation";
// import channelRecommendation from "./channelRecommendation";
// import searchResult from "./searchResult";
// import trending from "./trending";
// import likedVideo from "./likedVideo";
// import history from "./history";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  // localStorage에 저장합니다.
  storage,
  // 여러 reducer 중에 auth reducer만 localstorage에 저장합니다.
  whitelist: ['user']
  // blacklist -> 그것만 제외합니다
};

export const rootReducer = combineReducers({
  user,
  // feed,
  // video,
  // profile,
  sidebar,
  // recommendation,
  // channelRecommendation,
  // searchResult,
  // trending,
  // likedVideo,
  // history,
});

export default persistReducer(persistConfig, rootReducer);
