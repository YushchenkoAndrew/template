const { options, headers } = require("../config");
const { getToken, checkToken, httpRequest } = require("./http.handler");

async function addNewVisitor({ Country, ip, Visit_Date }) {
  try {
    let data = await httpRequest({
      ...options,
      headers,
      path: "/api/Visitor?Country=" + Country,
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
          path: "/api/Visitor",
          method: "POST",
        },
        JSON.stringify({ Country, ip, Visit_Date, Count: 1 })
      );
    else if (ip != data[0].ip || Visit_Date != result.Visit_Date)
      httpRequest(
        {
          ...options,
          headers: { ...headers, Authorization: "Bearer " + token.accessToken },
          path: "/api/Visitor?Country=" + Country,
          method: "PUT",
        },
        JSON.stringify({ ip, Visit_Date, Count: Number(data[0].Count) + 1 })
      );
  } catch (err) {
    return { success: false, message: err.message };
  }

  return { success: true };
}

async function getTableData(table) {
  let data = null;

  try {
    data = await httpRequest({
      ...options,
      headers,
      path: "/api/" + table,
      method: "GET",
    });
  } catch (err) {
    return { success: false, message: err.message };
  }

  return { success: true, data };
}

module.exports = { addNewVisitor, getTableData };
