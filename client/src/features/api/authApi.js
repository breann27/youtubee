import axios from "axios";

const API_URL = "http://localhost:5000/api/videos";

   export const likeVideo = async (videoId) => {
    const response = await axios.post(`${API_URL}/${videoId}/like`, {}, { withCredentials: true });
    return response.data;
  };