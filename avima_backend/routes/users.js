const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// post data
route.post("/add-user", async (req, res) => {
  try {
    const { fullName, email, password, role, phone, address } = req.body;

    if (!fullName || !email || !password || !phone || !address) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const checkEmail = "SELECT * FROM users WHERE email = ?";

    dbConn.query(checkEmail, [email],async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      if (data.length > 0) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // photo Upload
      let photoUrl = null;
      if(req.files && req.files.photo){
        const uplaodPhoto = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath,{
            folder:"Avima",
          }
        );
         console.log(uplaodPhoto);
         photoUrl=uplaodPhoto.secure_url;

      }

  

    const query =
      "INSERT INTO users(fullName,email,password,role,phone,address,photo) VALUES(?,?,?,?,?,?,?)";

    dbConn.query(
      query,
      [fullName, email, hash, role, phone, address, photoUrl],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({
          msg: "User Registered",
          id: result.insertId,
          photo: photoUrl,
        });
      },
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

    //  validation
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email & Password required",
      });
    }

    // find user or email

    const query = "SELECT * FROM users WHERE email = ?";

    dbConn.query(query, [email, password], async (err, data) => {
      if (err) {
        console.log("Error");

        return res.status(500).json({
          error: err.message,
        });
      }

      if (data.length === 0) {
        return res.status(400).json({
          msg: "User Not Found",
        });
      }

      // user check

      const user = data[0];
      console.log(user);

      // password Match

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);

      if (!isMatch) {
        return res.status(401).json({
          msg: "Invalid Password",
        });
      }

      // token

      const token = await jwt.sign(
        {
          uId: user.id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        msg: "Login Sucessfull",
        uId: user.id,
        fullName: user.fullName,
        email: user.email,
        token,
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error: err,
    });
  }
});
module.exports = route;
