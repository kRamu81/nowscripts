import axios, { InternalAxiosRequestConfig } from "axios";
import { url } from "../baseUrl";

const axiosInstance = axios.create({});

interface CustomAxiosConfig extends InternalAxiosRequestConfig<any> {
  headers: any;
}

axiosInstance.interceptors.request.use(
  async (config: CustomAxiosConfig) => {
    let token = localStorage.getItem("access_token");
    if (token) {
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Fallback if token was not JSON stringified
      }
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "UnAuthorized, JWT Expired"
    ) {
      let refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          refreshToken = JSON.parse(refreshToken);
        } catch (e) {
          // Fallback
        }
        try {
          const response = await axiosInstance.post(`${url}/auth/token`, {
            token: refreshToken,
          });
          localStorage.setItem(
            "access_token",
            JSON.stringify(response.data.access_token)
          );

          axiosInstance.defaults.headers["Authorization"] =
            "Bearer " + response.data.access_token;
          originalRequest.headers["Authorization"] =
            "Bearer " + response.data.access_token;
          return await axiosInstance(originalRequest);
        } catch (err: any) {
          console.log(err);
          // Don't clear local storage blindly on network errors during refresh token
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.clear();
            window.location.href = "/signin/in";
          }
        }
      } else {
        localStorage.clear();
        window.location.href = "/signin/in";
      }
    } else if (error.response?.status === 403) {
      alert("Access Denied");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const httpRequest = axiosInstance;
