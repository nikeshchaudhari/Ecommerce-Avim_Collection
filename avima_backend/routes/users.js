const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");
require("dotenv").config();

// post data
route.post("/add-user", async (req, res) => {
  try {
    const { fullName, email, password, role, phone, address } = req.body;

    if (!fullName || !email || !password || !phone || !address) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const hash = await bcrypt.hash(password, 10);

    // email check
    const checkEmail = "SELECT * FROM users WHERE email = ?";

    dbConn.query(checkEmail, [email], (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (data.length > 0) {
        return res.status(400).json({ msg: "Email already registered" });
      }
 
      // after email check passes
      const query =
        "INSERT INTO users(fullName,email,password,role,phone,address) VALUES(?,?,?,?,?,?)";

      dbConn.query(
        query,
        [fullName, email, hash, role || "user", phone, address],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          return res.status(200).json({
            msg: "Data Inserted",
            id: result.insertId,
          });
        }
      );
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// get all data

route.get("/all-user", async (req, res) => {
  try {
    const getAllUsers = "SELECT * FROM users";
    dbConn.query(getAllUsers, (err, data) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
      res.status(200).json({
        msg: "All Users",
        users: data,
      });
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
});

// login

route.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    

  
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error:err
    })
    
  }
});
module.exports = route;
