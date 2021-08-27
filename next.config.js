module.exports = {
  reactStrictMode: true,
  webpack5: true,
  basePath: "/projects",

  async headers() {
    return [
      {
        source: "/api/info/analytics",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2000, must-revalidate",
          },
        ],
      },
      {
        source: "/api/info/statistic",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2000, must-revalidate",
          },
        ],
      },
    ];
  },
};
