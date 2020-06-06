const http = require("http");

const host = "127.0.0.1";
const port = 8000;

const requestListener = function (req, res) {
  // modify the requestListener() function to return the appropriate header all JSON responses
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  // This time in the response.end() call, our string argument contains valid JSON.
  res.end(`{"message": "This is a JSON response"}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
