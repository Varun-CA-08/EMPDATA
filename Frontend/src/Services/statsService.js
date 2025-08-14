import axios from 'axios';

const BASE_URL = 'https://empdata-qurw.onrender.com/api/stats';

export const getStats = (token) => {
  return axios.get(`${BASE_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
