import axios from "axios";
import.meta.env.PROD;


const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? "https://api.sneakpeak.fr" : "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;