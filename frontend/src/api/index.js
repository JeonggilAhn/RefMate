/* global window */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/* docs : https://www.notion.so/woorively/9to6-174c93c039f9806ba0e0df0deccd9386?p=55a3cbd6e70f47bda4c0c628f093b24c&pm=s */

const getHeaders = () => {
  const headers = {};
  let accessToken = null;

  if (typeof window !== 'undefined') {
    accessToken = window.localStorage.getItem('access_token');
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

const get = (endpoint, params) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'get',
    headers: getHeaders(),
    params,
  });
};

const post = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'post',
    headers: getHeaders(),
    data,
  });
};

const put = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'put',
    headers: getHeaders(),
    data,
  });
};

const patch = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'patch',
    headers: getHeaders(),
    data,
  });
};

const del = (endpoint) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'delete',
    headers: getHeaders(),
  });
};

const logout = () => {
  return axios({
    url: `${API_BASE_URL}/auth/logout`,
    method: 'delete',
    headers: getHeaders(),
  });
};

export {
  get,
  post, // 생성
  patch, // 일부 수정
  put, // 전체 수정
  del,
  logout,
};
