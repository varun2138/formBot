import { BACKEND_URL } from "./authService";
import axios from "axios";
import { toast } from "react-hot-toast";

const createFolder = async (folderData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/folders/create`,
      folderData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
const getFolders = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/folders`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
const deleteFolder = async (folderId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/folders/${folderId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
const shareDashboard = async (data) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/share-dashboard`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

const getSharedDashboard = async () => {
  try {
    const token = sessionStorage.getItem("dashboardToken");
    const response = await axios.get(`${BACKEND_URL}/users/shared-dashboards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
const acceptDashboard = async (data) => {
  try {
    const token = sessionStorage.getItem("dashboardToken");
    if (!token) {
      throw new Error("token is missing");
    }
    const response = await axios.get(`${BACKEND_URL}/users/accept-dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: data,
      withCredentials: true,
    });
    console.log("dashboard accepted", response.data);
    return response.data;
  } catch (error) {
    console.log("error accepting dashboard", error);
  }
};

export {
  getFolders,
  getSharedDashboard,
  shareDashboard,
  createFolder,
  acceptDashboard,
  deleteFolder,
};
