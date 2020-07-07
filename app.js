const express = require("express");
const app = express();

const HOST = "192.168.0.103";
const PORT = 8000;

// app.get("/", (req, res) => res.sendFile("index.html", { root: __dirname }));

app.use(express.static("JS"));

app.listen(PORT, HOST);
console.log(`WebServer: http://${HOST}:${PORT}`);
