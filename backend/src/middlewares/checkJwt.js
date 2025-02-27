import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";

// Configuración de jwks-rsa para obtener la clave pública de Auth0
const client = jwksRsa({
  jwksUri: `${process.env.ISSUER}/.well-known/jwks.json`,
});

// Función para obtener la clave pública de Auth0
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.log("Error al obtener la clave pública de Auth0:", err);
      return callback(err);
    }
    const signingKey = key.getPublicKey() || key.rsaPublicKey;
    console.log("Clave pública obtenida:", signingKey);
    callback(null, signingKey);
  });
}

// Middleware para validar JWT con RS256
const checkJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtenemos el token del encabezado Authorization

  if (!token) {
    console.log("Authorization Header🔧🔧:", req.headers.authorization);
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Verificar el JWT usando jsonwebtoken y la clave pública de Auth0
  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
    },
    (err, decoded) => {
      if (err) {
        console.log("Token inválido:", err.message);
        return res
          .status(401)
          .json({ error: "Token inválido", details: err.message });
      }
      console.log("Token válido, decoded user:", decoded);
      req.user = decoded; // Guardar la información del usuario en la solicitud
      req.userRoles =
        decoded[`${process.env.ISSUER}/roles`] || []; // Guardar los roles del usuario
      next();
    }
  );
};

export default checkJwt;
