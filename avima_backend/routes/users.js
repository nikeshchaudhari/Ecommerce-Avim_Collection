const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

// post data
route.post("/add-user", async (req, res) => {
  try {
    const user = await dbConn.find({email:req.body.email}) ;
       console.log(user);
    const hash = await bcrypt.hash(req.body.password,10);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = hash;
    const role = req.body.role;

    const query = "INSERT INTO users(fullName,email,password)VALUES(?,?,?)";
    dbConn.query(query, [fullName, email, password], (err, result) => {
      res.status(200).json({
        msg: "Data Insert",
        id: result.insertId,
      });
    });
  } catch (err) {
    console.log("error");

    res.status(400).json({
      error: err,
    });
  }
});

module.exports = route;
