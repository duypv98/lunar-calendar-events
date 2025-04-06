import axios, { AxiosError, AxiosRequestConfig, ResponseType } from "axios";
import qs from "query-string";


export type RequestData = {
  endpoint?: string;
  method?: AxiosRequestConfig["method"],
  body?: any;
  customHeaders?: any;
  bodyType?: "json" | "multipart",
  responseType?: ResponseType;
  withCredentials?: boolean;
  signal?: AbortSignal;
};

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
}

// async function refreshTokenFunc() {
//   try {
//     const response = await post({ endpoint: "/refresh-token", withCredentials: true });
//     return response.error ? null : response.data;
//   } catch (error) {
//     return null;
//   }
// }

var requestRefreshToken: any = null;

const request = async (args: RequestData) => {
  const {
    endpoint,
    method = "GET",
    body,
    customHeaders = {},
    withCredentials = false,
    bodyType = "json",
    responseType,
    signal
  } = args;
  let _endpoint = endpoint;
  // if (!endpoint?.startsWith("http")) {
  //     _endpoint = `${endpoint}`;
  // }
  const headers = {
    ...defaultHeaders,
    ...customHeaders,
    // with access token
  }
  if (method === "POST" && bodyType === "multipart") headers["Content-Type"] = "multipart/form-data";

  try {
    // migrate to axios because fetch don't catch error 404: https://stackoverflow.com/questions/39297345/fetch-resolves-even-if-404
    const response = await axios.request({
      url: _endpoint,
      method,
      headers,
      data: body ? (bodyType === "multipart" ? body : JSON.stringify(body)) : undefined,
      withCredentials,
      responseType,
      signal
    });
    return {
      error: response.status !== 200,
      data: response.data,
      headers: response.headers
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      // const { status, data } = error.response || {};

      // if (endpoint !== "/refresh-token" && status === 401 && data?.data === AuthCode.AuthErrorCode.TokenExpired) {
      //     // TOKEN EXPIRED
      //     requestRefreshToken = requestRefreshToken || refreshTokenFunc();
      //     const refreshTokenData = await requestRefreshToken;
      //     requestRefreshToken = null;

      //     if (refreshTokenData) {
      //         const newResponse = await axios.request(error.config || {});
      //         return {
      //             error: newResponse.status !== 200,
      //             data: newResponse.data,
      //             headers: newResponse.headers
      //         }
      //     }

      // }
      throw error;
    }

    throw new Error('Unexpected Error')
  }
}

export const get = (args: Omit<RequestData, "method" | "body"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ endpoint: _endpoint, ...rest });
}

export const post = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "POST", endpoint: _endpoint, ...rest });
}

export const put = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "PUT", endpoint: _endpoint, ...rest });
}

export const patch = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "PATCH", endpoint: _endpoint, ...rest });
}

export const del = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "DELETE", endpoint: _endpoint, ...rest });
}

export type ApiResData<R> = Promise<{
  success: boolean;
  data: R;
}>