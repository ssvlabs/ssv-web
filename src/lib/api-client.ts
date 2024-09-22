import Axios from "axios";

export const api = Axios.create({
  headers: {
    "web-app-source": true,
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
