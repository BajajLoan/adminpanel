import api from "./axios";

/**
 * @param {string} method - get | post | put | delete
 * @param {string} url
 * @param {object} data
 */
const apiRequest = async (method, url, data = {}) => {
  try {
    const response = await api({
      method,
      url,
      data
    });

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);

    throw error.response?.data || {
      message: "Something went wrong"
    };
  }
};

export default apiRequest;
