require("dotenv").config();

// Basic Output Style
exports.logRequest = (req, ...info) => process.env.NODE_ENV != "test" && console.log(`\x1b[34m[${req} REQUEST]\x1b[0m${this.getTime()}`, ...info);

exports.getTime = () => {
  let arr = new Date().toString().split(" ");
  return "\x1b[35m[" + arr[4] + " " + [arr[2], arr[1], arr[3]].join("-") + "]\x1b[0m";
};

// Basic Output Style
exports.logError = (status, ...err) => process.env.NODE_ENV != "test" && console.log(`\x1b[31m[ERROR ${status}]\x1b[0m${this.getTime()}`, ...err);

// Basic Output Style
exports.logInfo = (...message) => process.env.NODE_ENV != "test" && console.log("\x1b[32m[INFO]\x1b[0m", ...message);

exports.logDebug = (...message) => console.log("\x1b[36m[DEBUG]\x1b[0m", ...message);

exports.errorHandler = (status, message, req, res) => {
  this.logError(status, message);
  if (res) res.status(status).send({ message });
};
