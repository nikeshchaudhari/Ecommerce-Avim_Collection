const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const Auth = require("../middleware/Auth");

// post category

route.post("/add-category", Auth, async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        msg: "categoryName is required!",
      });
    }

    const query = "INSERT INTO categories(categoryName)VALUES(?)";
    dbConn.query(query, [categoryName], (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }

      return res.status(200).json({
        msg: "CategoryName is added",
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error: err,
    });
  }
});

// get category

route.get("/all-data", async (req, res) => {
  try {
    const query = "SELECT * FROM categories";
    dbConn.query(query, (err, data) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }

      return res.status(200).json({
        msg: "All categories Data",
        categories: data,
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error: err,
    });
  }
});

// put or edit

route.put("/:id", Auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const { categoryName } = req.body;
    const query = "SELECT * FROM categories WHERE id = ? ";

    dbConn.query(query, [id], async (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: err.message,
        });
      }
      if (data.length === 0) {
        return res.status(404).json({
          msg: "Category not found",
        });
      }

      const updateQuery = "UPDATE categories SET categoryName=? WHERE id = ? ";
      dbConn.query(updateQuery, [categoryName, id], (err, data) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }
        return res.status(200).json({
          msg: "CategoryName updated successfully",
        });
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error: err,
    });
  }
});

// delete category

route.delete("/:id", Auth, async (req, res) => {
  try {
    const id = req.params.id;

    const getCategory = "SELECT * FROM categories WHERE id =?";
    dbConn.query(getCategory, [id], async (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) {
        return res.status(404).json({ msg: "Category not found" });
      }

    //   const category = data[0];
      const deleteQuery = "DELETE FROM categories WHERE id = ?";
      dbConn.query(deleteQuery, [id], async (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({
          msg: "Category deleted successfully",
        });
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
