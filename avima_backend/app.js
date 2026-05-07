const express = require("express");
const app = express();
const mysql = require("mysql2");
const fileUpload = require("express-fileupload");

const userRoute = require("./routes/users");

require("dotenv").config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}));
app.use("/users", userRoute);

module.exports = app;
