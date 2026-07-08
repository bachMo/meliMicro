import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Tant que les identifiants Upstash ne sont pas définis (variables
// d'environnement), redis vaut null et les routes API renvoient des
// valeurs neutres au lieu de planter — le site reste fonctionnel.
export const redis = url && token ? new Redis({ url, token }) : null;