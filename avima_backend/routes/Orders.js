const express = require("express")
const route = express.Router();
const dbConn = require("../config/db");
const Auth = require("../middleware/Auth");

// add orders
route.post("/add-order", Auth, async (req, res) => {
    try {
        const { userId, customerName,customerEmail,customerPhone,shippingAddress,status,items,total,notes,whatsapp_message } = req.body;

        // validation
        if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({
                msg: "All fields required"
            })
        }

        // insert data

        const orderQuery = "INSERT INTO orders(userId,customerName,customerEmail,customerPhone,shippingAddress,status,items,total,notes,whatsapp_message)VALUES(?,?,?,?,?,?,?,?,?,?)"

        dbConn.query(orderQuery,[userId, customerName,	customerEmail,	customerPhone,	shippingAddress,"pending",JSON.stringify(items),total,notes || null,whatsapp_message || null], async(err, data) => {

            if (err) {
                return res.status(500).json({
                    error: err.message,
                })
            }


            // update stock 

            for (let i = 0; i < items.length; i++) {
                const product = items[0];
                console.log(product);


                const updateStock = `UPDATE products SET stock = stock - ? WHERE id = ?`;


                dbConn.query(updateStock, [product.qty, product.productId,]);
            }
            return res.status(201).json({
                msg: "Order placed successfully",
                orderId: data.insertId,
            });
        })

    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
})

module.exports = route;