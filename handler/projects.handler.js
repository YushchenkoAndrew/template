const { logRequest, logError } = require("../lib");
const { options, headers } = require("../config");
const { getToken, checkToken, httpRequest } = require("./http.handler");

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

    let token = null;
    if (!process.env.TOKEN) token = await getToken();
    else {
      let { message } = await checkToken(process.env.TOKEN);
      token = message != "OK" ? await getToken() : { accessToken: process.env.TOKEN };
    }

    // Save Token in the env
    process.env.TOKEN = token.accessToken;

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
