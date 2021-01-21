require("dotenv").config();

const headers = { "Content-Type": "application/json" };

const options = {
  hostname: process.env.API_HOST,
  port: process.env.API_PORT,
};

const login = {
  user: process.env.API_USER,
  pass: process.env.API_PASS,
};

module.exports = { headers, options, login };
