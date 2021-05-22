require("dotenv").config();
const md5 = require("../middleware/md5");

const headers = { "Content-Type": "application/json" };

const options = {
  hostname: process.env.API_HOST,
  port: process.env.API_PORT,
};

const rand = Math.random().toString(16).slice(2);

const login = {
  user: process.env.API_USER,
  pass: md5(process.env.API_PASS + rand),
  rand,
};

module.exports = { headers, options, login };
