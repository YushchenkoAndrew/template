const express = require("express");
const routes = express.Router();
const handler = require("../handler/projects.handler");

routes.get("/:table/command/:task/:condition", (req, res) => {
  console.log("Test");
  res.send("Error");
});

routes.post("/:sendDB", (req, res) => {
  console.log("Test");
  res.send("Error");
});

module.exports = routes;
