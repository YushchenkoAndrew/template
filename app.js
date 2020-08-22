const express = require("express");
const app = express();

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
