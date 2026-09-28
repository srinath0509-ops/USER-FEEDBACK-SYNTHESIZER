import api from "./api";

export const getFeedback = async (filters = {}) => {
  const params = {};

  if (filters.sentiment && filters.sentiment !== "all") {
    params.sentiment = filters.sentiment;
  }

  if (filters.theme && filters.theme !== "all") {
    params.theme = filters.theme;
  }

  const response = await api.get("/feedback", {
    params,
  });

  return response.data;
};

export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);
  return response.data;
};