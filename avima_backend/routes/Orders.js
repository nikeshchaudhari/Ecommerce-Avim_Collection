const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const Auth = require("../middleware/Auth");
const Admin = require("../middleware/Admin");

// add orders
route.post("/add-order", Admin, async (req, res) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status,
      items,
      total,
      notes,
      whatsapp_message,
    } = req.body;

    // validation
    if (
      !customerName ||
      !customerPhone ||
      !shippingAddress ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        msg: "All fields required",
      });
    }

    // insert data

    const orderQuery =
      "INSERT INTO orders(userId,customerName,customerEmail,customerPhone,shippingAddress,status,items,total,notes,whatsapp_message)VALUES(?,?,?,?,?,?,?,?,?,?)";

    dbConn.query(
      orderQuery,
      [
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        "pending",
        JSON.stringify(items),
        total,
        notes || null,
        whatsapp_message || null,
      ],
      async (err, data) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }

        // update stock

        for (let i = 0; i < items.length; i++) {
          const product = items[0];
          console.log(product);

          const updateStock = `UPDATE products SET stock = stock - ? WHERE id = ?`;

          dbConn.query(updateStock, [product.qty, product.productId]);
        }
        return res.status(201).json({
          msg: "Order placed successfully",
          orderId: data.insertId,
        });
      },
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// view orders

route.get("/all-order", async (req, res) => {
  try {
    const query = "SELECT * FROM orders";
    dbConn.query(query, (err, data) => {
      if (err) {
        return res.status(400).json({
          msg: err.message,
        });
      }

      return res.status(200).json({
        msg: "All orders Data",
        Allorders: data,
      });
    });
  } catch (err) {
    console.log("Error");
    res.status(400).json({
      error: err,
    });
  }
});

// only self order view

route.get("/my-order", Auth, async (req, res) => {
  try {
    //     if (!req.user) {
    //   return res.status(401).json({ msg: "Unauthorized" });
    // }
    // console.log(req.user);
    const userId = req.user.id;
    console.log("UserID", userId);

    const query = "SELECT * FROM orders WHERE userId= ?";
    dbConn.query(query, [userId], (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: err.message,
        });
      }

      return res.status(200).json({
        msg: "My orders fetched successfully",
        orders: data,
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// edit or update

route.put("/update-order/:id", Admin, async (req, res) => {
  try {
    const id = req.params.id;

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status,
      items,
      total,
      notes,
      whatsapp_message,
    } = req.body;
    // update orders
    const updateQuery =
      "UPDATE orders SET customerName=?, customerEmail=?,  customerPhone=?,   shippingAddress=?,status=?, items=?, total=?, notes=?,  whatsapp_message=? WHERE id = ? ";

    dbConn.query(
      updateQuery,
      [
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        status,
        JSON.stringify(items),
        total,
        notes,
        whatsapp_message,
        id,
      ],
      (err, data) => {
        if (err) {
          return res.status(500).json({
            msg: err.message,
          });
        }

        return res.status(200).json({
          msg: "Order updated successfully",
        });
      },
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// delete only admin

route.delete("/:id", Admin, async (req, res) => {
  try {
    const id = req.params.id;
    const getOrder = "SELECT * FROM orders WHERE id = ?";
    dbConn.query(getOrder, [id], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const items = data[0];
      console.log(items);

      // delete data

      const deleteQuery = "DELETE FROM orders WHERE id = ?";
      dbConn.query(deleteQuery, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({
          msg: "Order deleted successfully",
        });
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});
module.exports = route;
