module.exports = {
  reactStrictMode: true,
  webpack5: true,
  swcMinify: false,
  basePath: "/projects",

  async headers() {
    return [
      {
        source: "/api/info/analytics",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1000, must-revalidate",
          },
        ],
      },
      {
        source: "/api/info/statistic",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1000, must-revalidate",
          },
        ],
      },
      {
        source: "/api/view/rand",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },

  serverRuntimeConfig: {
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
    APPLICATION_SECRET: process.env.APPLICATION_SECRET,

    API_HOST: process.env.API_HOST,
    API_PORT: process.env.API_PORT,
    API_USER: process.env.API_USER,
    API_PASS: process.env.API_PASS,
    API_PEPPER: process.env.API_PEPPER,

    BOT_URL: process.env.BOT_URL,
    BOT_KEY: process.env.BOT_KEY,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    ACCESS_KEY: process.env.ACCESS_KEY,

    FILE_SERVER_URL: process.env.FILE_SERVER_URL,
    FILE_SERVER_AUTH: process.env.FILE_SERVER_AUTH,

    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  },
};
