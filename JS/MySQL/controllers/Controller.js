const db = require("../models/index.js");

// module.exports =

exports.print = (req, res) => {
  db.Visitors.findAll().then((data) => console.log(data[0].dataValues));
};
