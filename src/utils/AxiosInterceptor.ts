import axios from "axios";
// import env from '../helpers/env_config'
import {
  getLocalStorage,
  getSessionStorage,
  removeLocalStorage,
  safeJSONParse,
  unsetLocalStorage,
} from "./helper";
import { SESSION, HEADER } from "./constants";

const tokenData: any = getLocalStorage(SESSION.TOKEN);
const parsedData = safeJSONParse(tokenData);
const API_BASE_URL = process.env.API_BASE_URL;
const AxiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  // mode: 'cors',
  headers: {
    "Content-Type": HEADER.CONTENT_TYPE,
    "Access-Control-Allow-Origin": "*",
    authorization: "Bearer " + `${parsedData?.tknsaavi}`,
  },

  timeout: HEADER.TIMEOUT,
});
export const axiosCallBlob = axios.create({
  responseType: "blob",
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    authorization: "Bearer " + `${parsedData?.tknsaavi}`,
  },
  timeout: HEADER.TIMEOUT,
});

axiosCallBlob.interceptors.request.use(
  (config) => {
    if (parsedData?.userID) {
      if (
        config.method === "post" ||
        config.method === "put" ||
        config.method === "patch"
      ) {
        config.data = {
          ...(config.data || {}),
          loggedUserID: parsedData?.userID,
        };
      } else if (config.method === "get" || config.method === "delete") {
        config.params = {
          ...(config.params || {}),
          loggedUserID: parsedData?.userID,
        };
      }
    }
    return config;
  },
  (error) => {
    // error goes here
    return Promise.reject(error);
  }
);

export const axiosCall = axios.create({
  baseURL: API_BASE_URL,
  // mode: 'cors',
  responseType: "blob",
  withCredentials: false,
  headers: {
    "Content-Type": HEADER.MULTIPART_CONTENT_TYPE,
    "Access-Control-Allow-Origin": "*",
    authorization: "Bearer " + parsedData?.tknsaavi,
  },
  timeout: HEADER.TIMEOUT,
});
axiosCall.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInterceptor.interceptors.request.use(
  (config) => {
    if (parsedData?.userID) {
      if (
        config.method === "post" ||
        config.method === "put" ||
        config.method === "patch"
      ) {
        config.data = {
          ...(config.data || {}),
          loggedUserID: parsedData?.userID,
        };
      } else if (config.method === "get" || config.method === "delete") {
        config.params = {
          ...(config.params || {}),
          loggedUserID: parsedData?.userID,
        };
      }
    }
    return config;
  },
  (error) => {
    // error goes here
    return Promise.reject(error);
  }
);
AxiosInterceptor.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 400) {
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    if (error.response.status === 401) {
      window.location.href = "/login";
      unsetLocalStorage(SESSION.TOKEN);
      error.response.data.message =
        "Session closed ....you have been logged out!";
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    if (error.response.status === 403) {
      error.response.data.message = "Authentication Fail";
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    if (error.response.status === 404) {
      error.response.data.message = "Not Found";
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    if (error.response.status === 500) {
      error.response.data.message = "Internal Server Error";
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    if (error.response.status === 508) {
      error.response.data.message = "Time Out";
      const response = { status: "error", msg: error.response.data.message };
      return Promise.reject(response);
    }
    // return Promise.reject(error)
  }
);
export default AxiosInterceptor;
