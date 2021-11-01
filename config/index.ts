import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const basePath = "/projects";
const apiHost =
  serverRuntimeConfig.API_HOST + ":" + serverRuntimeConfig.API_PORT;
const botHost = serverRuntimeConfig.BOT_URL;
const fileServer = serverRuntimeConfig.FILE_SERVER_URL;

export { apiHost, botHost, fileServer, basePath };
