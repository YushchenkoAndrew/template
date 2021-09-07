const apiHost =
  process.env.NODE_ENV == "production"
    ? `${process.env.API_HOST}:${process.env.API_PORT}`
    : "localhost:31337";

export { apiHost };
