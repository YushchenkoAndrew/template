import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const basePath = publicRuntimeConfig.BASE_PATH;
export const apiUrl = serverRuntimeConfig.API_URL;
export const botUrl = serverRuntimeConfig.BOT_URL;

export const voidUrl =
  process.env.NEXT_PUBLIC_VOID_URL || "http://127.0.0.1:8003/files";
export const localVoidUrl = serverRuntimeConfig.VOID_URL;
