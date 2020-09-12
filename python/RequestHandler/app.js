const { spawn } = require("child_process");
const express = require("express");
const app = express();

const HOST = "0.0.0.0";
const PORT = 18000;

app.get("/", (req, res) => {
  console.log("Yep");

  // Testing python call
  const python = spawn("python", ["./Test.py", "Test1", 10]);

  python.stdout.on("data", (data) => {
    console.log("~ Returned Data form python script");
    console.log(`\t=> ${data.toString().split("\n").join("\n\t=> ")}`);
  });

  res.send("Yep");
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
