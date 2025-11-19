import { apiFetch } from "../apiFetch/apiFetch";

export const editPost = async (postId, payload) => {

  const data = await apiFetch(`http://localhost:3000/post/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });

 
  return data
};
