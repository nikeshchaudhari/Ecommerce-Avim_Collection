const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const jwt = require("jsonwebtoken");
const Auth = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
require("dotenv").config();

// post
route.post("/setting", async (req, res) => {
  try {
    const { whatsapp_number, store_email, store_address, instagram_handle } =
      req.body;

    const query =
      "INSERT INTO store_setting(whatsapp_number, store_email, store_address, instagram_handle)  VALUES (?, ?, ?, ?)";

    dbConn.query(
      query,
      [whatsapp_number, store_email, store_address, instagram_handle],
      (err, data) => {
        if (err) {
          res.status(400).json({
            msg: err.message,
          });
        }
        return res.status(200).json({
          storeAdd: data.insertId,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get

route.get("/setting", async (req, res) => {
  try {
    const query = "SELECT * FROM store_setting Limit 1";
    dbConn.query(query, (err, data) => {
      if (err) {
        res.status(400).json({
          msg: err.message,
        });
      }
      return res.status(200).json({
        store: data,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// edit or update
route.put("/setting/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { whatsapp_number, store_email, store_address, instagram_handle } =
      req.body;

    const query =
      "UPDATE store_setting SET whatsapp_number = ?,  store_email = ?, store_address = ?,instagram_handle = ? WHERE id = ?";

    dbConn.query(
      query,
      [whatsapp_number, store_email, store_address, instagram_handle, id],
      (err, data) => {
        if (err) {
          res.status(400).json({
            msg: err.message,
          });
        }

        return res.status(200).json({
          msg: "Order updated successfully",
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete
route.delete("/setting/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM store_setting WHERE id = ?";
    dbConn.query(query, [id], (err, data) => {
      if (err) {
        res.status(400).json({
          msg: err.message,
        });
      }
      return;
      res.status(200).json({
        message: "Settings deleted",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = route;
