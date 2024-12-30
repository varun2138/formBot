import { BACKEND_URL } from "./authService";
import axios from "axios";
import { toast } from "react-hot-toast";

const createForm = async (folderData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/forms/create`,
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

const getForms = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/forms`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

const getProtectedForm = async (formId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/forms/protected/${formId}`,
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
const deleteForm = async (formId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/forms/${formId}`, {
      withCredentials: true,
    });

    toast.success("form deleted");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

const addFieldsToForm = async (formId, fields) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/forms/form/${formId}/fields`,
      { fields },
      { withCredentials: true }
    );
    console.log("fields added successfully", response.data);
    return response.data;
  } catch (error) {
    console.log("Error adding fields", error);
    toast.error(error?.response?.data?.message);
  }
};

const analytics = async (formId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/responses/form/${formId}`);
    return response.data;
  } catch (error) {
    console.log("Error getting responses", error);
    toast.error(error?.response?.data?.message);
  }
};
export {
  getForms,
  createForm,
  deleteForm,
  addFieldsToForm,
  getProtectedForm,
  analytics,
};
