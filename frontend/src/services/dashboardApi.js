import axios from "axios";

const dashboardApi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardData = async () => {
  const response = await dashboardApi.get("/dashboard");
  return response.data;
};

export default dashboardApi;