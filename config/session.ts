import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const sessionConfig = {
  cookieName: "SESSION_ID",
  cookieOptions: {
    secure: serverRuntimeConfig.NODE_ENV === "production",
  },
  password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
};

export default sessionConfig;
