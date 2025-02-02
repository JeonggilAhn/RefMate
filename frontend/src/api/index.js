import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* docs : https://www.notion.so/woorively/9to6-174c93c039f9806ba0e0df0deccd9386?p=55a3cbd6e70f47bda4c0c628f093b24c&pm=s */

const get = (endpoint) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'get',
  });
};

const post = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'post',
    data,
  });
};

const put = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'put',
    data,
  });
};

const patch = (endpoint, data) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'patch',
    data,
  });
};

const del = (endpoint) => {
  return axios({
    url: `${API_BASE_URL}/api/${endpoint}`,
    method: 'delete',
  });
};

const logout = () => {
  return axios({
    url: `${API_BASE_URL}/auth/logout`,
    method: 'delete',
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
