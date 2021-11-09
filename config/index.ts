import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const basePath = publicRuntimeConfig.BASE_PATH;
export const apiUrl = serverRuntimeConfig.API_URL;
export const botUrl = serverRuntimeConfig.BOT_URL;
export const voidUrl = serverRuntimeConfig.VOID_URL;
