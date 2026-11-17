// src/lib/api.js

import { clearCredentials, setCredentials } from "@/redux/slices/user";
import { store } from "@/redux/store";
import axios from "axios";
import { userEndPoints } from "../endpoints/user";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
    (config) => {
        const token = store.getState().user.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let refreshPromise = null;

function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = publicApi
            .post(userEndPoints.refreshToken)
            .then(response => {
                const data = response.data.data;
                const newToken = data?.accessToken;

                if (!newToken) {
                    throw new Error("Access token not received during refresh");
                }

                store.dispatch(setCredentials({
                    user: data.user,
                    accessToken: newToken,
                }));
                localStorage.setItem("accessToken", newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

authApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authApi(originalRequest);
        } catch (refreshError) {
            console.log("Error in axios Response Interceptor",refreshError.message);
            store.dispatch(clearCredentials());
            return Promise.reject(refreshError);
        }
    });


export { authApi, publicApi, refreshAccessToken };