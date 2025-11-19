import { refreshAccessToken } from "../Refresh_Token/refreshFetch";

export const apiFetch = async(url, options = {}) => {
   let token = localStorage.getItem("token");

  // Añadir token si no está presente
  options.headers = options.headers || {};
  if (token) options.headers["token"] = token;

  let res = await fetch(url, options);

  if (res.status === 401) {
    // Intentar refresh token
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Si falla, limpiar todo y devolver error
      localStorage.removeItem("token");
      localStorage.removeItem("token_refresh");
      localStorage.removeItem("user");
      throw new Error("Session expired");
    }

    // Reintento con token nuevo
    options.headers["token"] = newToken;
    res = await fetch(url, options);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return await res.json();
}