import axios from "axios";

const diaChiAPI = "http://hotrodoan:8000/api";

const ketNoiAxios = axios.create({
  baseURL: diaChiAPI,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

ketNoiAxios.interceptors.request.use((cauHinh) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    cauHinh.headers.Authorization = `Bearer ${token}`;
  }
  return cauHinh;
});

export default ketNoiAxios;
