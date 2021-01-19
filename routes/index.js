const express = require("express");
const routes = express.Router();
const handler = require("../handler/projects.handler");
const db = require("./db.routes");
const { convertToAscii } = require("../JS/ASCII-art");
const { logError } = require("../lib");

routes.get("/*", (req, res, next) => {
  handler.getRequest(req.url);
  next();
});

routes.post("/*", (req, res, next) => {
  handler.postRequest(req.url);
  next();
});

routes.post("/ASCII-art", (req, res) => {
  let { path, scale, repeat } = req.query;
  if (!path) {
    logError(400, "Wrong path declaration");
    res.status(400).send("Wrong path declaration");
  }

  convertToAscii(path, { scale, repeat })
    .then((data) => res.send(data))
    .catch((err) => {
      logError(500, err.message);
      res.status(500).send(err);
    });
});

routes.use("/db", db);

module.exports = routes;
