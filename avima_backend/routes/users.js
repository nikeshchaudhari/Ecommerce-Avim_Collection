const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
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
    const { fullName, email, password, phone, address } = req.body;
    const role = "user";

    if (!fullName || !email || !password || !phone || !address) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const checkEmail = "SELECT * FROM users WHERE email = ?";

    dbConn.query(checkEmail, [email], async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      if (data.length > 0) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // photo Upload
      let photoUrl = null;
      let photoId = null;
      if (req.files && req.files.photo) {
        const uplaodPhoto = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath,
          {
            folder: "Avima",
          },
        );
        console.log(uplaodPhoto);
        photoUrl = uplaodPhoto.secure_url;
        photoId = uplaodPhoto.public_id;
      }

      const query =
        "INSERT INTO users(fullName,email,password,role,phone,address,photo,photoId) VALUES(?,?,?,?,?,?,?,?)";

      dbConn.query(
        query,
        [fullName, email, hash, role, phone, address, photoUrl, photoId],
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

route.get("/all-user", (req, res) => {
  const getAllUsers = "SELECT * FROM users";
  dbConn.query(getAllUsers, (err, data) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.status(200).json({
      msg: "All Users",
      users: data,
    });
  });
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
          id: user.id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "10d",
        },
      );
      console.log("LOGIN SECRET:", process.env.JWT_SECRET);

      return res.status(200).json({
        msg: "Login Sucessfull",
        uId: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
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

// edit or update

route.put("/:id", Auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, email, password, role, phone, address } = req.body;

    let photoUrl = null;
    let photoId = null;

    const userGet = "SELECT * FROM users WHERE id =?";

    dbConn.query(userGet, [id], async (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: err.message,
        });
      }

      if (data.length === 0) {
        return res.status(404).json({
          msg: "User not found",
        });
      }

      const user = data[0];
      // console.log(data);

      if (req.files && req.files.photo) {
        // delete cloudinary photo

        if (user.photoId) {
          await cloudinary.uploader.destroy(user.photoId);
        }

        // upload new photot

        const upload = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath,
          {
            folder: "Avima",
          },
        );
        ((photoUrl = upload.secure_url), (photoId = upload.public_id));
      }

      let hash = user.password;

      if (password) {
        hash = await bcrypt.hash(password, 10);
      }
      // update query

      const updateData = `UPDATE users SET fullName = ?, email=?, password=?,phone=?,address=?,role=?, photo = IFNULL(?,photo), photoId =IFNULL(?,photoId) WHERE id = ?`;

      dbConn.query(
        updateData,
        [fullName, email, hash, phone, address, role, photoUrl, photoId, id],
        (err, data) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
            });
          }

          return res.status(200).json({
            msg: "User updated successfully",
          });
        },
      );
    });
  } catch (err) {
    console.log("Error");
  }
});

// delete row data

route.delete("/:id", Auth, (req, res) => {
  try {
    const id = req.params.id;

    const getUser = "SELECT * FROM users WHERE id = ?";

    dbConn.query(getUser, [id], async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = data[0];

      // delete photo

      if (user.photoId) {
        await cloudinary.uploader.destroy(user.photoId);
      }
      const deleteQuery = "DELETE FROM users WHERE id = ?";
      dbConn.query(deleteQuery, [id], async (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({
          msg: "User + image deleted successfully",
        });
      });
    });
  } catch (err) {
    console.log("error");
  }
});

// users-orders
route.get("/user-orders",  (req, res) => {
  try {
    const userId = req.params.id;
    const query = "SELECT u.id, COUNT(o.id) AS totalOrders FROM users u LEFT JOIN orders o ON  u.id = o.userId GROUP BY u.id ";
    dbConn.query(query,[userId],(err,data)=>{
      if(err){
        return res.status(500).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        msg:"User Orders",
        orders:data,
      });
    })

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// total orders


module.exports = route;
