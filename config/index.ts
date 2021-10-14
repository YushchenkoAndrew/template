import { useRouter } from "next/dist/client/router";

const apiHost =
  process.env.NODE_ENV == "production"
    ? `${process.env.API_HOST}:${process.env.API_PORT}`
    : "localhost:31337";

const botHost =
  process.env.NODE_ENV == "production"
    ? process.env.BOT_URL ?? ""
    : "localhost:3000";

const fileServer =
  process.env.NODE_ENV == "production"
    ? process.env.FILE_SERVER_URL ?? ""
    : "localhost:8003";

const basePath = "/projects";

export { apiHost, botHost, fileServer, basePath };
