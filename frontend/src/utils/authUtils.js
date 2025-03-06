// import jwtDecode from "jwt-decode";
// import Cookies from "js-cookie";

// export const storeIdTokenFromCookie = () => {
//   const idToken = Cookies.get("id_token");
//   if (idToken) {
//     localStorage.setItem("id_token", idToken);
//     console.log("ID token stored in localStorage");
//     return idToken;
//   }
//   return null;
// };

// export const getUserRoles = () => {
//   const token = localStorage.getItem("id_token");
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       return decodedToken[`${process.env.AUDIENCE}/roles`] || [];
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return [];
//     }
//   }
//   return [];
// };

// export const getAccessToken = () => {
//   return Cookies.get("access_token");
// };


/*
Este codigo es una implementacion del uso del token para guardarlo en localstorage. Pero ya que auth0 hace esto
internamente, no es necesario.
*/