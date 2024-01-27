const dbConfig = require("../config/db");
import { Sequelize } from "sequelize-typescript";
import Files from "./file";
import DocBox from "./docbox";
import UsersDocBoxes from "./uses_docboxes";
import applyAssociations from "./associations";

const sequelize = new Sequelize({
  database: dbConfig.database,
  dialect: dbConfig.dialect,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  // logging: console.log,
});

sequelize.addModels([DocBox, Files, UsersDocBoxes]);

applyAssociations(sequelize);
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: false });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to connect to the database or synchronize:", error);
  }
};

export default sequelize;

export { sequelize, initializeDatabase, DocBox, Files, UsersDocBoxes };
