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

// post

route.post("/add-gallery", async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "Avima/gallery",
      },
    );

    const sql = `
      INSERT INTO gallery
      (image_url, imageId, caption)
      VALUES (?, ?, ?)
    `;

    dbConn.query(sql, [result.secure_url, result.public_id, caption], (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        success: true,
        message: "Gallery image uploaded",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// get

route.get("/all-gallery", (req, res) => {
  const sql = `
    SELECT *
    FROM gallery
    ORDER BY  created_at DESC
  `;

  dbConn.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      gallery: data,
    });
  });
});

// update

route.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const oldData = "SELECT * FROM gallery WHERE id =?";

    dbConn.query(oldData, [id], async (err, data) => {
      if (err) return res.status(500).json(err);

      if (!data.length) {
        return res.status(404).json({
          message: "Image not found",
        });
      }

      let image_url = data[0].image_url;
      let imageId = data[0].imageId;

      if (req.files?.image) {
        await cloudinary.uploader.destroy(imageId);

        // new upload
        const result = await cloudinary.uploader.upload(
          req.files.image.tempFilePath,
          {
            folder: "Avima/gallery",
          },
        );

        image_url: result.secure_url;
        imageId: result.public_id;
      }

      // query
      const query = `UPDATE gallery SET image_url =?, imageId=?, caption=? WHERE id =? `;

      dbConn.query(query, [image_url, imageId, caption, id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json({
          success: true,
          message: "Gallery updated",
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// delete

route.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = "SELECT * FROM gallery WHERE id = ?";
    dbConn.query(oldData, [id], async (err, data) => {
      if (err) return res.status(500).json(err);
      if (!data.length) {
        return res.status(404).json({
          message: "Image not found",
        });
      }
      const imageId = data[0].imageId;
      await cloudinary.uploader.destroy(imageId);
      console.log(imageId);
      

      const query = "DELETE FROM gallery WHERE id = ?";
      dbConn.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({
          success: true,
          message: "Gallery deleted successfully",
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = route;
