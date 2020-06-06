const http = require("http");
const fs = require("fs").promises;

const host = "127.0.0.1";
const port = 8000;

// The books variable is a string that contains JSON for an array of book objects.
// Each book has a title or name, an author, and the year it was published.
const books = JSON.stringify([
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
]);

//The authors variable is a string that contains the JSON for an array of author objects.
// Each author has a name, a country of birth, and their year of birth.
const authors = JSON.stringify([
  { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
  { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 },
]);

//Now that we have the data our responses will return

let indexFile;

// Create a website with a tree structure
// in our requestListener() function to handle a request whose URL
// contains /todos, so Node.js returns the same JSON message by default.

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  // switch statement on the request’s URL
  switch (req.url) {
    case "/books":
      res.writeHead(200);
      res.end(books);
      break;

    case "/authors":
      res.writeHead(200);
      res.end(authors);
      break;

    case "/":
      res.writeHead(200);
      res.end(JSON.stringify({ Test: "Hello world!" }));
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
};

fs.readFile(__dirname + "/index.html")
  .then((contents) => {
    indexFile = contents;
  })
  .catch((err) => {
    console.error(`Could not read index.html file: ${err}`);
    process.exit(1);
  });

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
