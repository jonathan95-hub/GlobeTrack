import { apiFetch } from "../apiFetch/apiFetch";

export const deletedNotification = async (notificationId) => {

  const data = await apiFetch(`http://localhost:3000/notification/delete/${notificationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
     
    }
  });
   
  return data
};
