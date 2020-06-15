//The Comma Separated Values (CSV) file format is a text standard that’s commonly
// used for providing tabular data. In most cases, each row is separated by a newline,
// and each item in the row is separated by a comma.

const http = require("http");

const host = "127.0.0.1";
const port = 8000;

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment;filename=oceanpals.csv");
  res.writeHead(200);
  res.end(`id,name,email\n1,Sammy Shark,shark@ocean.com`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
