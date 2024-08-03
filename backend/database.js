const { Database } = require("@sqlitecloud/drivers");
require("dotenv").config();

const db = new Database(process.env.SQLITE_URI, (err) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to the SQLite Cloud database");
  }
});

module.exports = db;
