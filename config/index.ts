const apiHost =
  process.env.NODE_ENV == "production"
    ? `${process.env.API_HOST}:${process.env.API_PORT}`
    : "localhost:31337";

const botHost =
  process.env.NODE_ENV == "production"
    ? process.env.BOT_URL ?? ""
    : "localhost:3000";

export { apiHost, botHost };
