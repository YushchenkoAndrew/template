const sessionConfig = {
  cookieName: "SESSION_ID",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  password: process.env.APPLICATION_SECRET ?? "",
};

export default sessionConfig;
