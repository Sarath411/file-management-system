const pg = require("pg");

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectModule: pg,
  // logging: process.env.DB_LOG === 'true',
  // pool: {
  //     max: process.env.DB_POOL_MAX,
  //     min: process.env.DB_POOL_MIN,
  //     acquire: process.env.DB_POOL_ACQUIRE,
  //     idle: process.env.DB_POOL_IDLE
  // }
};
