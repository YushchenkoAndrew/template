// var mysql = require("mysql");
const Sequelize = require("sequelize");
const { Op, DataTypes } = Sequelize;

async function connect() {
  var sequelize = new Sequelize("Test", "root", "6sCMqddng4agAcj", {
    host: "192.168.0.105",
    dialect: "mysql",
  });

  await sequelize
    .authenticate()
    .then((err) => console.log("\n~ Connected to DataBase"))
    .catch((err) => console.log("\n~ Unable to connect to db" + err));

  // Test if it work
  // sequelize.query("select * from potluck").then(function (rows) {
  //   console.log(JSON.stringify(rows));
  // });

  const item = sequelize.define(
    "potluck",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.DataTypes.STRING },
      food: { type: Sequelize.DataTypes.STRING },
      confirmed: { type: Sequelize.DataTypes.CHAR },
      signup_date: { type: Sequelize.DataTypes.DATE },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  item.findAll().then((data) => console.log(data));

  // sequelize.close();
}

module.exports.connect = connect;
