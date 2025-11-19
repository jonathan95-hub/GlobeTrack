// src/core/services/homepage/allPostFetch.js
import { apiFetch } from "../apiFetch/apiFetch"; // importa tu helper centralizado

export const allPostFetch = async (page = 1) => {
  try {
    const data = await apiFetch(`http://localhost:3000/post/allpost?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return data;
  } catch (error) {
    console.error("[allPostFetch] Error:", error.message);
    throw error;
  }
};
export default allPostFetch