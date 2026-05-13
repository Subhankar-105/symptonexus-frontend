import { API } from "./api";

export const submitFeedback = async (data: {
  rating: number;
  experience: string;
}) => {
  try {
    const res = await API.post("/feedback", data);
    return res.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};