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

// FIXME:
app.post("/guest", jsonParser, (req, res) => {
  console.log(`~ Get some Activity on Website from guest`);
  let indent = " ".repeat(5);
  let data = req.body.data.split("\n");
  for (let i in data) console.log(`${indent}  ${data[i]}`);
  res.sendStatus(200);
});

app.post("/db/:sendDB", jsonParser, async (req, res) => {
  console.log(`~ Get some Activity on Website from guest`);
  let indent = " ".repeat(5);
  for (let i in req.body) console.log(`${indent}=> ${req.body[i]}`);
  console.log();

  let { Country, ip, Visit_Date } = req.body;

  console.log(req.body);

  let result = await db.findAll("Country", Country);

  console.log(result);

  result = result[0] ? result[0].dataValues : undefined;

  console.log(result);

  if (!result) await db.create([`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=1`]);
  else if (!ip.includes(result.ip) || !Visit_Date.includes(result.Visit_Date))
    await db.update([`Country=${Country}`, `ip=${ip}`, `Visit_Date=${Visit_Date}`, `Count=${result.Count + 1}`]);

  if (Number(req.params.sendDB)) db.print().then((data) => res.send(data));
  else res.sendStatus(200);
});

app.get("/db/command/:task/:condition", (req, res) => {
  console.log(req.params.task);

  switch (req.params.task) {
    case "print": {
      db.print()
        .then((data) => {
          for (let i in data) console.log(data[i].dataValues);
          res.send(data);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "findAll": {
      db.findAll(...req.params.condition.split("="))
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "create": {
      db.create(req.params.condition.split(","))
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "delete": {
      db.delete(...req.params.condition.split("="))
        .then((data) => {
          if (data) res.send("Information was deleted successfully");
          else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    case "update": {
      db.update(req.params.condition.split(","))
        .then((data) => {
          if (data) res.send("Information was updated successfully");
          else res.status(500).send(`Such element as '${key} = ${value}' not exist!`);
        })
        .catch((err) => res.status(500).send(err.message));
      break;
    }
    default:
      res.sendStatus(404);
  }
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
