export const refreshAccessToken = async () => {
  console.log("🔄 refreshAccessToken() llamado");

  const refreshToken = localStorage.getItem("token_refresh");
    console.log("📦 refreshToken almacenado:", refreshToken);

 if (!refreshToken) {
    console.log("❌ No hay refresh token en localStorage");
    return null;
  }

  const res = await fetch("http://localhost:3000/auth/refreshtoken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token_refresh": refreshToken
    }
  });
   console.log("📩 Respuesta del servidor en refresh:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Error del servidor:", text);
    return null;
  }

  const data = await res.json();
    console.log("🔐 Tokens nuevos recibidos:", data);

   if (!data.token) {
    console.log("❌ El servidor NO devolvió token");
    return null;
  }
  localStorage.setItem("token", data.token);
  localStorage.setItem("token_refresh", data.token_refresh);

  return data.token;
};