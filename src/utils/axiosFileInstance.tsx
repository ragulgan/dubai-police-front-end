import axios from 'axios';
import { getLocalStorage, getSessionStorage, safeJSONParse, unsetLocalStorage } from './helper';
import { SESSION, HEADER } from './constants';

const API_BASE_URL = process.env.API_BASE_URL;
const tokenData: any = getLocalStorage(SESSION.TOKEN);
const parsedData = safeJSONParse(tokenData);

const AxiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'multipart/form-data',
    'escriptMasterDataType': 'merchants',
    "authorization": 'Bearer ' + `${parsedData?.tknsaavi}`
  },
  timeout: HEADER.TIMEOUT,
});


// REQUEST INTERCEPTOR
AxiosInterceptor.interceptors.request.use(config => {
  const loggedUserID = parsedData?.userID;
  if (parsedData?.userID) {
    if (config.data instanceof FormData) {
      config.data.append("loggedUserID", loggedUserID);
    } else if (typeof config.data === "object") {
      config.data = { ...config.data, loggedUserID };
    }
  }
  return config
}, error => {
  // error goes here
  return Promise.reject(error)
})

// RESPONSE INTERCEPTOR
AxiosInterceptor.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      return Promise.reject({ status: 'error', msg: 'No response from server' });
    }

    let message = 'Something went wrong';
    switch (response.status) {
      case 400:
        message = response.data?.message || 'Bad Request';
        break;
      case 401:
        // window.location.href = "/login";
        unsetLocalStorage(SESSION.TOKEN)
        message = 'Session closed... you have been logged out!';
        break;
      case 403:
        message = 'Authentication failed';
        break;
      case 404:
        message = 'Not Found';
        break;
      case 500:
        message = 'Internal Server Error';
        break;
      case 508:
        message = 'Time Out';
        break;
      default:
        message = response.data?.message || message;
    }

    const customError = {
      status: 'error',
      msg: message,
    };

    return Promise.reject(customError);
  }
);

export default AxiosInterceptor;