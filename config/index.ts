import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const basePath = serverRuntimeConfig.BASE_PATH;
export const apiUrl = serverRuntimeConfig.API_URL;
export const botUrl = serverRuntimeConfig.BOT_URL;
export const voidUrl = serverRuntimeConfig.VOID_URL;
