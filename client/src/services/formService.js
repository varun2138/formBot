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

export { getForms, createForm, deleteForm };
