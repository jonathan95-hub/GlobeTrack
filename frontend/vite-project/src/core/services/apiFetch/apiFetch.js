import { refreshAccessToken } from "../Refresh_Token/refreshFetch";

export const apiFetch = async (url, options = {}) => {

  // Pillamos el token del localStorage (el de acceso normal)
  let token = localStorage.getItem("token");

  // Si el usuario pasó headers, los respetamos. Si no, creamos un objeto vacío
  options.headers = options.headers || {};

  // Si existe token, lo metemos en los headers para que el backend sepa quién eres
  if (token) options.headers["token"] = token;

  // Hacemos el fetch normal con el token actual
  let res = await fetch(url, options);

  // Si da 401 significa: "este token ya no sirve"
  if (res.status === 401) {

    // Intentamos sacar un token nuevo usando el refresh token
    const newToken = await refreshAccessToken();

    // Si no hay token nuevo significa que el refresh token también expiró → sesión muerta
    if (!newToken) {
      // Quitamos todo lo relacionado con la sesión
      localStorage.removeItem("token");
      localStorage.removeItem("token_refresh");
      localStorage.removeItem("user");

      // Lanzamos error para que el front reaccione (normalmente redirige al login)
      throw new Error("Session expired");
    }

    // Si sí conseguimos token nuevo, lo ponemos en los headers
    options.headers["token"] = newToken;

    // Y reintentamos la misma petición, pero ahora con token fresquito
    res = await fetch(url, options);
  }

  // Si la petición sigue sin ir bien (400, 500, etc.), sacamos el texto del error
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text); // Lanzamos el error para manejarlo fuera
  }

  // Si todo ha ido bien, devolvemos el JSON ya parseado
  return await res.json();
};
