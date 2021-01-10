const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./JS/MySQL/controllers/Controller.js");
const { convertToAscii } = require("./JS/ASCII-art");

var jsonParser = bodyParser.json();

const HOST = "0.0.0.0";
const PORT = 8000;

app.post("/projects/db/:sendDB", jsonParser, async (req, res) => {
  console.log(`~ Get some Activity on Website from guest`);
  let indent = " ".repeat(5);
  for (let i in req.body) console.log(`${indent}=> ${req.body[i]}`);
  console.log();

  let { Country, ip, Visit_Date } = req.body;

  let result = await db.findAll("Visitors", "Country", Country);
  result = result[0] ? result[0].dataValues : undefined;

  if (!result) await db.create("Visitors", [`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=1`]);
  else if (!ip.includes(result.ip) || !Visit_Date.includes(result.Visit_Date))
    await db.update("Visitors", [`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=${result.Count + 1}`]);

  if (Number(req.params.sendDB)) {
    let data = {};
    data["Visitors"] = await db.print("Visitors");
    data["Views"] = await db.print("Views");
    res.send(data);
  } else res.sendStatus(200);
});

app.get("/projects/db/:table/command/:task/:condition", (req, res) => {
  console.log(req.params.task);

  switch (req.params.task) {
    case "print": {
      db.print(req.params.table)
        .then((data) => {
          for (let i in data) console.log(data[i].dataValues);
          res.send(data);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "findAll": {
      db.findAll(req.params.table, ...req.params.condition.split("="))
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "create": {
      db.create(req.params.table, req.params.condition.split(","))
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "delete": {
      db.delete(req.params.table, ...req.params.condition.split("="))
        .then((data) => {
          if (data) res.send("Information was deleted successfully");
          else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "update": {
      db.update(req.params.table, req.params.condition.split(","))
        .then((data) => {
          if (data) res.send("Information was updated successfully");
          else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    default:
      res.status(404);
      res.sendFile(__dirname + "/FileNotFound.html");
  }
});

app.get("/projects/*", async (req, res, next) => {
  console.log(`~ Get request to ${req.url}`);
  const time = new Date();
  console.log(`\t=> At ${time}\n`);

  if (req.url.substr(-1) == "/" && !req.url.includes("Info")) {
    let result = await db.findAll("Views", "Curr_Date", new Date().toISOString().slice(0, 10));
    result = result[0] ? result[0].dataValues : undefined;

    if (!result) await db.create("Views", [`Curr_Date=${new Date().toISOString().slice(0, 10)}`, `Count=1`]);
    else await db.update("Views", [`Curr_Date=${new Date().toISOString().slice(0, 10)}`, `Count=${result.Count + 1}`]);
  }

  next();
});

app.post("/projects/ASCII-art", (req, res) => {
  console.log(`~ POST request to ${req.url}`);
  const time = new Date();
  console.log(`\t=> At ${time}\n`);

  let { path, scale, repeat } = req.query;
  if (!path) res.status(400).send("Wrong path declaration");

  convertToAscii(path, { scale, repeat })
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send(err));
});

app.use("/projects", express.static("JS"));

app.get("/*", (req, res) => {
  console.log(`\n~ Unexpected URL: ${req.url}`);
  let time = new Date();
  console.log(`\t=> At ${time}`);
  console.log(`\t=> File '${req.url.split("/").pop()}' not found\n`);

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
