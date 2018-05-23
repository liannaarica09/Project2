var Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("Users", {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    pollen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    airQuality: {
      type: DataTypes.BOOLEAN,
      degaultValue: false,
    },
    wind: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    humidity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    temperature: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    uvIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ragWeed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    grass: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
  return User;
};