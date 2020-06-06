const http = require("http");
const fs = require("fs").promises;

const host = "127.0.0.1";
const port = 8000;

let indexFile;

// Run a basic website design from html file

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  // When we access our server in the browser, we will see an HTML page
  // with one header tag containing This is HTML (indexFile).
  res.end(indexFile);
};

// fs module contains a readFile() function that we’ll use to load the HTML file in place
// The special variable __dirname has the absolute path of where the Node.js code is being run
fs.readFile(__dirname + "/index.html")
  .then((contents) => {
    indexFile = contents;
  })
  .catch((err) => {
    // Our error handler has changed as well. If the file can’t be loaded,
    // we capture the error and print it to our console. We then exit the Node.js
    // program with the exit() function without starting the server. This way we can see
    // why the file reading failed, address the problem, and then start the server again.
    console.error(`Could not read index.html file: ${err}`);
    process.exit(1);
  });

// create server and make use of our request listener
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
