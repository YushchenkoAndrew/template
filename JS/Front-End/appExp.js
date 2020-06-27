const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.sendFile("index.html", { root: __dirname }));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
