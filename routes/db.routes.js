const express = require("express");
const routes = express.Router();
const handler = require("../handler/db.handler");
const { logRequest } = require("../lib/");

routes.post("/Visitor", async (req, res) => {
  logRequest("POST", `TABLE = 'Visitors' DATA =`, req.body);

  let result = await handler.addNewVisitor(req.body);

  if (result.success) res.json(result);
  else res.status(500).json(result);
});

routes.get("/tables", async (req, res) => {
  const tables = req.query.name.split(",");
  logRequest("GET", `TABLES = [${tables}]`);

  let data = {};
  for (let table of tables) {
    let result = await handler.getTableData(table);

    if (!result.success) return res.status(500).send(result);
    else data[table] = result.data;
  }

  res.send(data);
});

module.exports = routes;
