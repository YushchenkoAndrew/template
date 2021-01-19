require("dotenv").config();
const { logInfo, logError, errorHandler } = require("./lib");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = require("./routes");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 80;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Simple request for check it Server is alive
app.get("/ping", (req, res) => res.send("pong"));

// Determining Routers setting
app.use("/projects", router);
app.use("/projects", express.static("JS"));

// Catch 404 and forward to error handler
app.use((req, res, next) => errorHandler(404, `Not Found '${req.url}'`, req, res));

// Error handler
app.use((err, req, res, next) => errorHandler(err.status, err.message.split("\n")[0], req, res));

process.on("SIGINT", function () {
  logInfo("Server Terminated");
  process.exit();
});

app.listen(PORT, HOST, (err) => {
  if (err) logError(500, `Error appear: ${err.message}`);
  logInfo("Server Started ...");
  logInfo(`Listening on Port ${PORT}`);
});
