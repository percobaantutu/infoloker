import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    // Corrected Key: API_PATHS.IMAGE.UPLOAD
    // Removed 'Content-Type': 'multipart/form-data'. Let Axios set it.
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

export default uploadImage;
