import axios from "axios";
import { BASE_URL } from "../utils";

const strictInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
});

strictInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      !originalRequest._retry ||
      !originalRequest.url.includes("/login") ||
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
        strictInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return strictInstance(originalRequest);
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

export default strictInstance;
