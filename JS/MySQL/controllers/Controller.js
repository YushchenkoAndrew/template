const db = require("../models/index.js");

exports.print = () => db.Visitors.findAll().then((data) => console.log(data[0].dataValues));

exports.findAll = (condition) => {};
