module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "Views",
    {
      id: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      Curr_Date: { type: Sequelize.DataTypes.DATEONLY },
      Count: { type: Sequelize.DataTypes.INTEGER },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
