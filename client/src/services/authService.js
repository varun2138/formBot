import axios from "axios";
import { toast } from "react-hot-toast";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log(BACKEND_URL);

const register = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/register`,
      userData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Registration error", error);
    toast.error(error?.response?.data?.message);
    throw error.response ? error.response.data : error.message;
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/users/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("login error", error);
    toast.error(error?.response?.data?.message);
    throw error.response ? error.response.data : error.message;
  }
};

const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/users/update`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("update error", error);
    toast.error(error?.response?.data?.message);
    throw error.response ? error.response.data : error.message;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log("logged out succesfully");
    return response.data;
  } catch (error) {
    console.log("logout error", error);
    toast.error(error?.response?.data?.message);
    throw error.response ? error.response.data : error.message;
  }
};

export { register, login, updateUser, logout };
