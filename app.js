const express = require("express");
const app = express();
const time = new Date();

const HOST = "0.0.0.0";
const PORT = 8000;

app.get("/projects/*", (req, res, next) => {
  console.log(`~ Get request to ${req.url}`);
  console.log(`\t=> At ${time}`);
  console.log(`\t=> From Client ${req.connection.remoteAddress}\n`);
  next();
});

app.use("/projects", express.static("JS"));

app.get("/*", (req, res) => {
  console.log(`\n~ Unexpected URL: ${req.url}`);
  console.log(`\t=> File '${req.url.split("/").pop()}' not found\n`);
  res.status(404);
  res.send("404: File Not Found");
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
