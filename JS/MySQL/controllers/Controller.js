const { Visitors, Views } = require("../models/index.js");

function getTable(name) {
  switch (name) {
    case "Visitors":
      return Visitors;
    case "Views":
      return Views;
  }
}

exports.print = (table) => getTable(table).findAll();

exports.findAll = (table, key, value) => {
  let condition = {};
  condition[key] = value || null;

  return getTable(table).findAll({ where: condition });
};

exports.create = (table, data) => {
  let newVisitor = {};

  for (let i in data) {
    let params = data[i].split("=");
    newVisitor[params[0]] = params[1] || null;
  }

  return getTable(table).create(newVisitor);
};

exports.delete = (table, key, value) => {
  let condition = {};
  condition[key] = value;

  return getTable(table).destroy({ where: condition });
};

exports.update = (table, data) => {
  let condition = data.splice(0, 1)[0].split("=");
  let where = {};
  where[condition[0]] = condition[1];

  let newValue = {};

  for (let i in data) {
    let params = data[i].split("=");
    newValue[params[0]] = params[1];
  }

  return getTable(table).update(newValue, { where: where });
};
