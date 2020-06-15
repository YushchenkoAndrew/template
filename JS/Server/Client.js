/**
 * This program create a simple example (Echo Server) of standard protocol Client/Server
 *  Communication realizes using tcp socket.
 *  Main idea: create Client at JS and Server at Python (Raspberry)
 */

var net = require("net");

const HOST = "192.168.0.103";
const PORT = 13327;

var client = new net.Socket();
client.connect(PORT, HOST, function () {
  console.log("Client:\tClient connected to Server!");
  client.write("Send data to Server");
});

client.on("data", function (data) {
  console.log(`Server:\t${data}`);
  client.write(data); // Client as Echo Server
  if (data == "Close") client.destroy();
});
