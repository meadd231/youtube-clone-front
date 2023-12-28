import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const createAxiosInstance = (token) => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    headers: {
      "Cache-Control": "no-cache",
      authorization: `Bearer ${token}`, // authorization 헤더에 토큰을 추가
    },
  });
  // axios interceptors는 봉인해두고 나중에 사용하도록 하자.
  // axiosInstance.interceptors.response.use(
  //   (response) => {
  //     // 응답 코드 200번대 일 때 이 함수 호출
  //     console.log('interceptors', response);
  //     return response;
  //   },
  //   (error) => {
  //     // 응답 코드 200번대 이외에서 이 함수 호출
  //     if (error.response && error.response.status) {
  //       switch (error.response.status) {
  //         // status code가 401인 경우 `logout`을 커밋하고 `/login` 페이지로 리다이렉트
  //         case 401:
  //           toast("로그인이 올바르지 않습니다.");
  //           break;
  //         default:
  //           return Promise.reject(error);
  //       }
  //     }
  //   }
  // );
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        // Access Token이 없으면 로그인 페이지로 리다이렉트 또는 다른 처리 수행
        return config;
      }

      let decodedToken = jwtDecode(accessToken);
      console.log("Decoded Token", decodedToken);
      let currentDate = new Date();

      // JWT exp is in seconds
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        // 토큰 만료됨.
        console.log("Token expired.");
        // refresh token 검증
        const refreshToken = localStorage.getItem("refreshToken");
        try {
          // 여기에서 refresh token을 사용하여 서버에 새로운 access token을 요청
          // 이거 await 하지 말고 then, catch가 더 나을 것 같음. await를 쓰는 이유가 없음.
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/auth/token/refresh`,{refreshToken}
          );

          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          config.headers.authorization = `Bearer ${newAccessToken}`;

          console.log("Token refreshed successfully");
          return config;
        } catch (refreshError) {
          if (refreshError.response) {
            const { status, data } = refreshError.response;

            if (status === 401 && data.refreshTokenExpired) {
              // refresh token 만료 에러
              // 로그아웃 로직 추가하기
            } else {
              // 다른 에러
            }
          }
          console.error("Error refreshing token", refreshError);
          // 여기에서 갱신 실패 처리 로직을 추가할 수 있습니다.
          throw refreshError; // 예외를 다시 던져서 요청을 중단하거나 다른 처리를 할 수 있습니다.
        }
      } else {
        console.log("Valid token");
        config.headers.authorization = `Bearer ${accessToken}`;
        return config;
      }
    },
    (error) => {}
  );
  return axiosInstance;
};

/**
 * @returns
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // Access Token이 없으면 로그인 페이지로 리다이렉트 또는 다른 처리 수행
    return null;
  }

  try {
    // Access Token이 유효한지 확인
    // const decodedToken = jsonwebtoken.verify(accessToken, 'your-access-token-secret');

    // 유효하면 현재 Access Token 반환
    return accessToken;
  } catch (error) {
    // Access Token이 만료된 경우
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // Refresh Token이 없으면 로그인 페이지로 리다이렉트 또는 다른 처리 수행
      return null;
    }

    // Refresh Token을 사용하여 새로운 Access Token 요청
    const response = await fetch("http://localhost:3001/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    // 새로운 Access Token 저장
    localStorage.setItem("accessToken", data.accessToken);

    return data.accessToken;
  }
};

export const processDate = (datetime) => {
  return datetime.substring(0, 10);
};

export const relativeDate = (datetime) => {
  const date = new Date(datetime);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} 년 전`;
  } else if (months > 0) {
    return `${months}개월 전`;
  } else if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return `${seconds}초 전`;
  }
};

export const client = async (endpoint, { body, ...customConfig } = {}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (customConfig.token) {
    config.headers.authorization = `Bearer ${customConfig.token}`;
  }

  if (!customConfig.token && user?.token) {
    config.headers.authorization = `Bearer ${user.token}`;
  }

  const res = await fetch(endpoint, config);
  const data = await res.json();

  if (res.status !== 200) {
    return toast(data.message);
  }

  return data;
};

export const upload = async (resourceType, file) => {
  const formData = new FormData();
  formData.append("upload_preset", "youtubeclone");
  formData.append("file", file);

  let toastId = null;
  const config = {
    onUploadProgress: (p) => {
      const progress = p.loaded / p.total;
      if (toastId === null) {
        toastId = toast("Upload in Progress", {
          progress,
        });
      } else {
        toast.update(toastId, {
          progress,
        });
      }
    },
  };

  const { data } = await axios.post(
    `${process.env.REACT_APP_CLOUDINARY_ENDPOINT}/${resourceType}/upload`,
    formData,
    config
  );

  toast.dismiss(toastId);

  return data.secure_url;
};

export const authenticate = async (type, data) => {
  const backendUrl = process.env.REACT_APP_BE;

  try {
    const { data: token } = await client(`${backendUrl}/auth/${type}`, {
      body: data,
    });

    if (token) {
      const { data: user } = await client(`${backendUrl}/auth/me`, { token });

      localStorage.setItem("user", JSON.stringify({ ...user, token }));

      return { ...user, token };
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeChannelLocalSt = (channelId) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const updated = {
    ...user,
    channels: user.channels.filter((channel) => channel.id !== channelId),
  };

  localStorage.setItem("user", JSON.stringify(updated));
};

export const addChannelLocalSt = (channel) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const updated = {
    ...user,
    channels: [channel, ...user.channels],
  };

  localStorage.setItem("user", JSON.stringify(updated));
};

export const updateUserLocalSt = (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const updatedUser = { ...user, ...data };
  localStorage.setItem("user", JSON.stringify(updatedUser));
};
