const { spawn } = require("child_process");
const express = require("express");
const app = express();

const HOST = "0.0.0.0";
const PORT = 18000;

// Default setup
var pythonSript = spawn("python", ["./Main.py", "g", 0]);

app.get("/led/:command/:value", (req, res) => {
  console.log("~ Recieve request to change LED");

  // Send SIGTERM to process
  pythonSript.kill("SIGKILL")

  // Run python script
  pythonSript = spawn("python", ["./Main.py", req.params.command, req.params.value]);

  pythonSript.stdout.on("data", (data) => {
    console.log("~ Returned Data form python script");
    console.log(`\t=> ${data.toString().split("\n").join("\n\t=> ")}`);
  });

  pythonSript.stderr.on('data', (data) => {
    console.log(data.toString());
  })


  res.send("OK");

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
