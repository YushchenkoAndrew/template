const express = require("express");
const app = express();

const HOST = "0.0.0.0";
const PORT = 8000;

// app.get("/", (req, res) => res.sendFile("index.html", { root: __dirname }));
// app.get("/projects", (req, res) => app.use(express.static("JS")));

app.use("/projects", express.static("JS"));

process.on("SIGINT", function () {
  process.exit();
});

app.listen(PORT, HOST);
console.log(`WebServer: http://${HOST}:${PORT}`);
