import { apiFetch } from "../apiFetch/apiFetch";

export const getPostUserFetch = async (userId) => {
  try {
    const data = await apiFetch(
      `http://localhost:3000/post/userpost/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error cargando publicaciones del usuario:", error);
    throw error;
  }
};
