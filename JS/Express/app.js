const express = require("express");
const app = express();
const PORT = 8080;

// app.get("/", (req, res) => res.sendFile("index.html", { root: __dirname }));

app.use(express.static("../p5"));
app.use(express.static("public"));

app.listen(PORT, () => console.log(`WebServer: http://localhost:${PORT}`));
