import axios from "axios";

const analyticsApi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAnalyticsSummary = async () => {
  const response = await analyticsApi.get("/analytics/summary");
  return response.data;
};

export default analyticsApi;