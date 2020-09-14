module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "Visitors",
    {
      id: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Country: { type: Sequelize.DataTypes.STRING },
      ip: { type: Sequelize.DataTypes.STRING },
      Visit_Date: { type: Sequelize.DataTypes.DATEONLY },
      Count: { type: Sequelize.DataTypes.INTEGER },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
