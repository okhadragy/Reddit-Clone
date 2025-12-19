import axios from "axios";

const api = axios.create({
<<<<<<< Updated upstream
  baseURL: "http://localhost:5000",
=======
  baseURL: "http://localhost:5000/",
>>>>>>> Stashed changes
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
