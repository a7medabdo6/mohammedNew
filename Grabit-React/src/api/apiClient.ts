import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ API المحلي
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ إضافة التوكن إلى الهيدر إذا كان موجودًا في localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // جلب التوكن من localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // إضافة التوكن إلى الهيدر
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
