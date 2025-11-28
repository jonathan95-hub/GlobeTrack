// Función que intenta refrescar el token de acceso usando el refresh token
export const refreshAccessToken = async () => {

  // Tomamos el refresh token del localStorage
  const refreshToken = localStorage.getItem("token_refresh");
  

  // Si no hay refresh token, no se puede renovar el acceso
  if (!refreshToken) {
    return null; // Retornamos null para indicar que no se pudo refrescar
  }

  // Hacemos una petición POST al endpoint que genera un nuevo token
  // Incluimos el refresh token en los headers
  const res = await fetch("http://localhost:3000/auth/refreshtoken", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json", // Decimos que vamos a enviar JSON
      "token_refresh": refreshToken        // Pasamos el refresh token al backend
    }
  });
 

  // Si el servidor responde con un error (400, 401, 500, etc.)
  if (!res.ok) {
    const text = await res.text(); // Leemos el mensaje de error del servidor
    return null; // Retornamos null porque no se pudo refrescar el token
  }

  // Si todo va bien, obtenemos los datos en formato JSON
  const data = await res.json();

  // Verificamos que el servidor realmente devolvió un token de acceso
  if (!data.token) {

    return null; // Retornamos null si no hay token
  }

  // Guardamos el nuevo token de acceso y el refresh token actualizado en localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("token_refresh", data.token_refresh);

  // Devolvemos el nuevo token de acceso para que pueda usarse en las peticiones
  return data.token;
};
