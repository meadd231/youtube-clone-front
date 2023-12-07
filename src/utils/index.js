import axios from "axios";
import { toast } from "react-toastify";

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
  return axiosInstance;
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

export const timeSince = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }

  return Math.floor(seconds) + " seconds";
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
