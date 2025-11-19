import { apiFetch } from "../apiFetch/apiFetch";

export const markNotificationAsRead = async (notificationId) => {

  const data = await apiFetch(`http://localhost:3000/notification/read/${notificationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
     
    }
  });
   
  return data
};
