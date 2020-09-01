const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./JS/MySQL/controllers/Controller.js");

var jsonParser = bodyParser.json();

const HOST = "0.0.0.0";
const PORT = 8000;

app.get("/projects/*", (req, res, next) => {
  console.log(`~ Get request to ${req.url}`);
  const time = new Date();
  console.log(`\t=> At ${time}`);

  const forwarded = req.headers["x-forwarded-for"];
  const clientIP = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  console.log(`\t=> From Client ${clientIP}\n`);
  next();
});

app.use("/projects", express.static("JS"));

app.post("/guest", jsonParser, (req, res) => {
  console.log(`~ Get some Activity on Website from guest`);
  let indent = " ".repeat(5);
  let data = req.body.data.split("\n");
  for (let i in data) console.log(`${indent}  ${data[i]}`);
  res.sendStatus(200);
});

app.get("/db", (req, res) => {
  console.log(req.query.title);
  console.log(req.params.id);

  db.print();

  res.send("Connection to DataBase");
});

app.get("/db:id", (req, res) => {
  console.log(req.params.id);
  res.sendStatus(200);
});

app.get("/*", (req, res) => {
  console.log(`\n~ Unexpected URL: ${req.url}`);
  let time = new Date();
  console.log(`\t=> At ${time}`);
  console.log(`\t=> File '${req.url.split("/").pop()}' not found\n`);

  const forwarded = req.headers["x-forwarded-for"];
  const clientIP = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  console.log(`\t=> From Client ${clientIP}\n`);

  res.status(404);
  res.sendFile(__dirname + "/FileNotFound.html");
});

process.on("SIGINT", function () {
  console.log("~ Server Terminated");
  process.exit();
});

app.listen(PORT, HOST, (err) => {
  if (err) console.log(`~ Error appear ${err}`);
  console.log("~ Server Started ...");
  console.log(`~ Listening on Port ${PORT}`);
});
