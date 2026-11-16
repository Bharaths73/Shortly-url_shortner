import axios from "axios"
import {authApi, publicApi} from "./axios/axiosConfig";
import { store } from "@/redux/store";
import { setCredentials } from "@/redux/slices/user";
import { userEndPoints } from "./endpoints/user";

export async function loginAction(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await publicApi.post(
      userEndPoints.login,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const user = response.data?.data;

    if (!user?.accessToken) {
      return {
        success: false,
        user: null,
        message: "Authentication token not received",
      };
    }

    store.dispatch(setCredentials({
      user,
      accessToken: user.accessToken,
    }));
    localStorage.setItem("accessToken", user.accessToken);
    return {
      success: true,
      user,
      message: "Login successful",
    };

  } catch (error) {
    return {
      success: false,
      user: null,
      message:
        error.response?.data?.message ||
        "Invalid email or password",
    };
  }
}

export async function registerUser(userData){
    const response = await publicApi.post(userEndPoints.register, userData);
    const user = response.data?.data;
    return user;
}
