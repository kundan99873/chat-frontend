import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authenticateUser = async () => {
  const result = await axiosInstance.get(`/user/authenticate`);
  return await result.data;
};
export const refreshToken = async () => {
  const result = await axiosInstance.get(`/user/refresh_token`);
  return await result.data;
};

export const loginUser = async (data) => {
  const result = await axiosInstance.post(`/user/login`, data);
  return await result.data;
};

export const logoutUser = async (data) => {
  const result = await axiosInstance.post(`/user/logout`, data);
  return await result.data;
};

export const getLoginUserDetails = async (data) => {
  const result = await axiosInstance.get(`/user/login-user-details`, data);
  return await result.data;
};

export const getAvailableUsers = async (data) => {
  const result = await axiosInstance.get(`/user/all-users`, {
    params: data,
  });
  return await result.data;
};

export const getMessages = async (id, page) => {
  const result = await axiosInstance.get(`/chat/get-messages/${id}`, {
    params: { page, limit: 15 },
  });
  return await result.data;
};

export const getUserDetailsById = async (id) => {
  const result = await axiosInstance.get(`/user/get-user-details/${id}`);
  return await result.data;
};

export const updateSeenMessage = async (data) => {
  const result = await axiosInstance.post(`/chat/seen-messages`, data);
  return await result.data;
};
