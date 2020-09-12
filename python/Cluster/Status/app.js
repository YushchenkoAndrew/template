const { spawn } = require("child_process");
const express = require("express");
const app = express();

const HOST = "0.0.0.0";
const PORT = 18000;

app.get("/led/:command/:value", (req, res) => {
  console.log("~ Recieve request to change LED");

  // Run python script
  const python = spawn("python", ["./Main.py", req.params.command, req.params.value]);

  python.stdout.on("data", (data) => {
    console.log("~ Returned Data form python script");
    console.log(`\t=> ${data.toString().split("\n").join("\n\t=> ")}`);
  });

  python.stderr.on('data', (data) => {
    console.log(data.toString());
  })

  // Send SIGTERM to process
  // python.kill("SIGQUIT");

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
