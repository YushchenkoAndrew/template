require("dotenv").config();
const http = require("http");
const { logRequest, logError } = require("../lib");

const headers = { "Content-Type": "application/json" };
const options = {
  hostname: process.env.API_HOST,
  port: process.env.API_PORT,
};

const login = {
  user: process.env.API_USER,
  pass: process.env.API_PASS,
};

let token = null;

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

const checkToken = ({ accessToken: token }) =>
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

async function getRequest(file) {
  logRequest("GET", "PATH =", file);

  if (file.substr(-1) != "/" || file.includes("Info")) return;

  try {
    const currDate = new Date().toISOString().slice(0, 10);
    let data = await httpRequest({
      ...options,
      headers,
      path: "/api/Views?Curr_Date=" + currDate,
      method: "GET",
    });

    if (!token) token = await getToken();
    else {
      let { message } = await checkToken(token);
      if (message != "OK") token = await getToken();
    }

    if (!data || !data[0])
      httpRequest(
        {
          ...options,
          headers: { ...headers, Authorization: "Bearer " + token.accessToken },
          path: "/api/Views?Curr_Date=" + currDate,
          method: "POST",
        },
        JSON.stringify({ Curr_Date: currDate, Count: 1 })
      );
    else
      httpRequest(
        {
          ...options,
          headers: { ...headers, Authorization: "Bearer " + token.accessToken },
          path: "/api/Views?Curr_Date=" + currDate,
          method: "PUT",
        },
        JSON.stringify({ Count: Number(data[0].Count) + 1 })
      );
  } catch (err) {
    logError(500, err.message);
  }
}

function postRequest(file) {
  logRequest("POST", "PATH =", file);
}

module.exports = { getRequest, postRequest };
