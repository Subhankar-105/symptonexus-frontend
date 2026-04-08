import axios from "axios";
import { urls } from "../Environment";

export const API = axios.create({
  baseURL: urls.baseUrl,
  headers: { "Content-Type": "application/json" }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
