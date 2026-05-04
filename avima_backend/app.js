const express = require("express");
const app = express();
const mysql = require("mysql2");

const userRoute = require("./routes/users");
app.use(express.json())
app.use("/users", userRoute);

module.exports = app;
