const mysql = require("mysql2");

require("dotenv").config();

const dbConnect = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DB_NAME,
});
dbConnect.connect((err) => {
  if (err) {
    console.log("DB connection failed", err);
    return;
  } else {
    console.log("Db connected");
  }
});

module.exports = dbConnect;
