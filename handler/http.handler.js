const http = require("http");
const { options, headers, login } = require("../config");

const getToken = () =>
  httpRequest(
    {
      ...options,
      headers,
      path: "/api/login",
      method: "POST",
    },
    JSON.stringify(login)
  );

const checkToken = (token) =>
  httpRequest({
    ...options,
    headers: { ...headers, Authorization: "Bearer " + token },
    path: "/api/token",
    method: "GET",
  });

function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    let data = "";

    let req = http.request(options, (res) => {
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          resolve(res.statusCode != 204 ? JSON.parse(data) : null);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) req.write(body);
    req.end();
  });
}

module.exports = { getToken, checkToken, httpRequest };
