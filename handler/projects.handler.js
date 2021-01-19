const { logRequest } = require("../lib");

// app.get("/projects/*", async (req, res, next) => {
//   console.log(`~ Get request to ${req.url}`);
//   const time = new Date();
//   console.log(`\t=> At ${time}\n`);

//   if (req.url.substr(-1) == "/" && !req.url.includes("Info")) {
//     let result = await db.findAll("Views", "Curr_Date", new Date().toISOString().slice(0, 10));
//     result = result[0] ? result[0].dataValues : undefined;

//     if (!result) await db.create("Views", [`Curr_Date=${new Date().toISOString().slice(0, 10)}`, `Count=1`]);
//     else await db.update("Views", [`Curr_Date=${new Date().toISOString().slice(0, 10)}`, `Count=${result.Count + 1}`]);
//   }

//   next();
// });

function getRequest(file) {
  logRequest("GET", "PATH =", file);
}

function postRequest(file) {
  logRequest("POST", "PATH =", file);
}

module.exports = { getRequest, postRequest };
