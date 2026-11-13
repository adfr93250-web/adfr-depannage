/**
 * Adresse de l'API.
 * En production (Vercel), on passe par le même domaine que le site (/api, redirigé vers le
 * serveur Render par vercel.json) : sans ça, l'iPhone bloque les cookies de connexion admin
 * car ils viendraient d'un autre domaine. En développement, on garde l'adresse directe.
 */
export const API = process.env.REACT_APP_API_PATH || `${process.env.REACT_APP_BACKEND_URL}/api`;
