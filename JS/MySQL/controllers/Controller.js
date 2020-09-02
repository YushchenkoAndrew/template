const { Visitors } = require("../models/index.js");

exports.print = () => Visitors.findAll();

exports.findAll = (key, value) => {
  let condition = {};
  condition[key] = value || null;

  return Visitors.findAll({ where: condition });
};

exports.create = (data) => {
  let newVisitor = {};

  for (let i in data) {
    let params = data[i].split("=");
    newVisitor[params[0]] = params[1] || null;
  }

  return Visitors.create(newVisitor);
};

exports.delete = (key, value) => {
  let condition = {};
  condition[key] = value;

  return Visitors.destroy({ where: condition });
};

exports.update = (data) => {
  let condition = data.splice(0, 1)[0].split("=");
  let where = {};
  where[condition[0]] = condition[1];

  let newValue = {};

  for (let i in data) {
    let params = data[i].split("=");
    newValue[params[0]] = params[1];
  }

  return Visitors.update(newValue, { where: where });
};
