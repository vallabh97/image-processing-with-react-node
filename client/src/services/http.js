import axios from "axios";

export const post = (endpoint, data) => {
  return axios.post(`http://localhost:3001/${endpoint}`, data);
};
