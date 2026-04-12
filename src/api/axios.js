import axios from "axios";

// 🔥 YOUR LOCAL IP HERE
const BASE_URL = "http://192.168.1.4:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default api;