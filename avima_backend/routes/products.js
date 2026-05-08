const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Auth = require("../middleware/Auth");
require("dotenv").config();

// add products

route.post("/add-products", Auth, async (req, res) => {
  try {
    const {
      name,
      gender,
      description,
      price,
      discount,
      stock,
      slug,
      sizes,
      colors,
      brand,
      featured,
      status,

      discount_starts_at,
      discount_ends_at,
      categoryId,
    } = req.body;

    //    photo add

    let photoUrl = null;
    let photoId = null;

    if (req.files && req.files.photo) {
      const upload = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "Avima/avima_products",
        },
      );

      photoUrl = upload.secure_url;
      photoId = upload.public_id;
    }

    // add data
    const query =
      "INSERT INTO products(name,gender,description,price,discount,stock,slug,sizes,colors,brand,featured, status,photo,photoId,  discount_starts_at,  discount_ends_at,categoryId)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    dbConn.query(
      query,
      [
        name,
        gender,
        description,
        price,
        discount,
        stock,
        slug,
        sizes,
        colors,
        brand,
        featured,
        status,
        photoUrl,
        photoId,

        discount_starts_at,
        discount_ends_at,
        Number(categoryId)
      ],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }

        console.log({
          name,
          categoryId,
          photoUrl,
          photoId,
        });
        return res.status(201).json({
          msg: "Product added successfully",
          productId: data.insertId,
        });
      },
    );
  } catch (err) {
    console.log("Error");
    res.status(500).json({ error: err.message });
  }
});

module.exports = route;
