import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json"
  // }
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    console.error("API ERROR:", error?.response?.data);

    // 🔥 TOKEN INVALID / EXPIRED
    if (status === 401 || message === "Admin access denied") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      // force logout + redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
