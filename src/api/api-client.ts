import axios, { AxiosRequestConfig } from "axios";
import { getDeviceID, getDevicePlatform } from "@/lib/device-info";

// ----------------------------------------------------------------------
const accessKey = process.env.NEXT_PUBLIC_ACCESS_TOKENKEY!;
const refreshKey = process.env.NEXT_PUBLIC_REFRESH_TOKENKEY!;

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.withCredentials = true;
    // config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["X-TIMEZONE"] = -new Date().getTimezoneOffset() / 60;
    config.headers.deviceId = getDeviceID();
    config.headers.platform = getDevicePlatform();
    return config;
  },
  (err) => {
    throw new Error(err);
  },
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // if (error?.response?.status === 401) {
    //   window.location.href = "/?signIn=true";
    // }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    );
  },
);

export default axiosInstance;

// ----------------------------------------------------------------------
export const axiosGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<T>(url, { ...config });
  return res.data;
};

export const axiosPost = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<T>(url, config?.data, config);
  return res.data;
};

export const axiosPut = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.put<T>(url, config?.data, config);
  return res.data;
};

export const axiosDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.delete<T>(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

export const getAccessToken = (): string => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(accessKey);
    return token || "";
  }
  return "";
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined" && token !== "") {
    localStorage.setItem(accessKey, token);
    document.cookie = `${accessKey}=${token}; path=/; max-age=${60 * 60 * 24 * 7};samesite=strict; httponly=true`;
  }
};

export const getRefreshToken = (): string => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(refreshKey);
    return token || "";
  }
  return "";
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined" && token !== "") {
    localStorage.setItem(refreshKey, token);
  }
};

export const removeAllTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(accessKey);
    localStorage.removeItem(refreshKey);
    document.cookie = `${accessKey}=; path=/; max-age=0`;
    document.cookie = `${refreshKey}=; path=/; max-age=0`;
  }
};
