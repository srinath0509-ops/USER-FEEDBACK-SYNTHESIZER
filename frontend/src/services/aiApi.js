import api from "./api";

export const askAI = async (message) => {
  const response = await api.post("/agent/chat", { message });
  return response.data;
};

export const getAIInsights = async () => {
  const response = await api.get("/agent/insights");
  return response.data;
};

export const getMemoryStats = async () => {
  const response = await api.get("/agent/memory-stats");
  return response.data;
};

export const getBeforeAfter = async (message) => {
  const response = await api.post("/agent/before-after", {
    message,
  });
  return response.data;
};