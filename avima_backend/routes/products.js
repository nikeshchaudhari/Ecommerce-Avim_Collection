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
        Number(categoryId),
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

// get all data
route.get("/all-products", async (req, res) => {
  try {
    const query = "SELECT * FROM products";

    dbConn.query(query, (err, data) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
      return res.status(200).json({
        msg: "All Products",
        products: data,
      });
    });
  } catch (err) {
    console.log("Error");
  }
});

// edit or update

route.put("/:id", Auth, async (req, res) => {
  try {
    const id = req.params.id;

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

    let photoUrl = null;
    let photoId = null;

    const query = "SELECT * FROM products WHERE id =?";
    dbConn.query(query, [id], async (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: err.message,
        });
      }

      if (data.length === 0) {
        return res.status(404).json({
          msg: "Products not found",
        });
      }

      const items = data[0];
      //   console.log(items);

      if (req.files && req.files.photo) {
        // delete cloudinary photo

        if (items.photoId) {
          await cloudinary.uploader.destroy(items.photoId);
        }

        const upload = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath,
          {
            folder: "Avima/avima_products",
          },
        );
        ((photoUrl = upload.secure_url), (photoId = upload.public_id));
      }

      const updateProducts = `
UPDATE products SET
  name = ?,
  gender = ?,
  description = ?,
  price = ?,
  discount = ?,
  stock = ?,
  slug = ?,
  sizes = ?,
  colors = ?,
  brand = ?,
  featured = ?,
  status = ?,
  photo = IFNULL(?,photo),
  photoId = IFNULL(?,photoId),
  discount_starts_at = ?,
  discount_ends_at = ?,
  categoryId = ?
WHERE id = ?
`;
      dbConn.query(
        updateProducts,
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
          Number(categoryId),
          id,
        ],
        (err, data) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
            });
          }

          return res.status(200).json({
            msg: "Products updated successfully",
          });
        },
      );
    });
  } catch (err) {
    console.log("error");
  }
});

// delete data or products

route.delete("/:id", Auth, async (req, res) => {
  try {
    const id = req.params.id;

    const getProduct = "SELECT * FROM products WHERE id =?";

    dbConn.query(getProduct, [id], async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) {
        return res.status(404).json({ msg: "Products not found" });
      }
      const items = data[0];
      //   console.log(items);

      if (items.photoId) {
        await cloudinary.uploader.destroy(items.photoId);
      }

      const deleteQuery = "DELETE FROM products WHERE id =?";

      dbConn.query(deleteQuery, [id], async (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({
          msg: "Product deleted successfully",
        });
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
        error:err.message
    })
  }
});

module.exports = route;
