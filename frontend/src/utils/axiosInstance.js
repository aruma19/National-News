import axios from "axios";
import { BASE_URL } from "../utils";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/token")
    ) {
      originalRequest._retry = true;
      try {
        const refresh = await axios.get(`${BASE_URL}/token`, {
          withCredentials: true,
        });

        const newAccessToken = refresh.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update Authorization header for future requests
        instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
