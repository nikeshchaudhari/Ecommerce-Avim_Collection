const express = require("express");
const route = express.Router();
const dbConn = require("../config/db");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Auth = require("../middleware/Auth");
const Admin = require("../middleware/Admin");
require("dotenv").config();

// add products

// route.post("/add-products", Auth, async (req, res) => {
//   try {
//     const {
//       name,
//       gender,
//       description,
//       price,
//       discount,
//       stock,
//       slug,
//       sizes,
//       colors,
//       brand,
//       featured,
//       status,

//       discount_starts_at,
//       discount_ends_at,
//       categoryId,
//     } = req.body;

//     //    photo add

//     let photoUrl = null;
//     let photoId = null;

//     if (req.files && req.files.photo) {
//       const upload = await cloudinary.uploader.upload(
//         req.files.photo.tempFilePath,
//         {
//           folder: "Avima/avima_products",
//         },
//       );

//       photoUrl = upload.secure_url;
//       photoId = upload.public_id;
//     }

//     // add data
//     const query =
//       "INSERT INTO products(name,gender,description,price,discount,stock,slug,sizes,colors,brand,featured, status,photo,photoId,  discount_starts_at,  discount_ends_at,categoryId)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

//     dbConn.query(
//       query,
//       [
//         name,
//         gender,
//         description,
//         price,
//         discount,
//         stock,
//         slug,
//         sizes,
//         colors,
//         brand,
//         featured,
//         status,
//         photoUrl,
//         photoId,

//         discount_starts_at,
//         discount_ends_at,
//         Number(categoryId),
//       ],
//       (err, data) => {
//         if (err) {
//           return res.status(500).json({
//             error: err.message,
//           });
//         }

//         console.log({
//           name,
//           categoryId,
//           photoUrl,
//           photoId,
//         });
//         return res.status(201).json({
//           msg: "Product added successfully",
//           productId: data.insertId,
//         });
//       },
//     );
//   } catch (err) {
//     console.log("Error");
//     res.status(500).json({ error: err.message });
//   }
// });

// multiple product added
route.post("/add-products", Admin, async (req, res) => {
  try {
    const {
      name,
      gender,
      description,
      story,
      price,
      discount_percent,
      discount_amount,
      stock,
      slug,
      sizes,
      colors,
      active,
      brand,
      featured,
      status,
      discount_starts_at,
      discount_ends_at,
      category,
    } = req.body;

    let photosArray = [];
    let photoId = [];

    // CHECK MULTIPLE FILES
    if (req.files && req.files.photos) {
      let files = req.files.photos;

      // if only one file
      if (!Array.isArray(files)) {
        files = [files];
      }

      for (let i = 0; i < files.length; i++) {
        const upload = await cloudinary.uploader.upload(files[i].tempFilePath, {
          folder: "Avima/products",
        });

        console.log(upload);

        photosArray.push({
          url: upload.secure_url,
          photoId: upload.public_id, 
        });
      }
    }

    const query = `
      INSERT INTO products
      (name, gender, description,story, price, discount_percent,discount_amount, stock, slug,
       sizes, colors,active, brand, featured, status, photos,
       discount_starts_at, discount_ends_at, category)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    dbConn.query(
      query,
      [
        name,
        gender,
        description,
        story,
        price,
        discount_percent,
        discount_amount,
        stock,
        slug,
        JSON.stringify(sizes),
        JSON.stringify(colors),
        active,
        brand,
        featured,
        status,
        JSON.stringify(photosArray), // IMPORTANT
        discount_starts_at,
        discount_ends_at,
        category,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({
          msg: "Product added successfully",
          productId: result.insertId,
        });
      },
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
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

// route.put("/:id", Auth, async (req, res) => {
//   try {
//     const id = req.params.id;

//     const {
//       name,
//       gender,
//       description,
//       price,
//       discount,
//       stock,
//       slug,
//       sizes,
//       colors,
//       brand,
//       featured,
//       status,

//       discount_starts_at,
//       discount_ends_at,
//       categoryId,
//     } = req.body;

//     let photoUrl = null;
//     let photoId = null;

//     const query = "SELECT * FROM products WHERE id =?";
//     dbConn.query(query, [id], async (err, data) => {
//       if (err) {
//         return res.status(500).json({
//           msg: err.message,
//         });
//       }

//       if (data.length === 0) {
//         return res.status(404).json({
//           msg: "Products not found",
//         });
//       }

//       const items = data[0];
//       //   console.log(items);

//       if (req.files && req.files.photo) {
//         // delete cloudinary photo

//         if (items.photoId) {
//           await cloudinary.uploader.destroy(items.photoId);
//         }

//         const upload = await cloudinary.uploader.upload(
//           req.files.photo.tempFilePath,
//           {
//             folder: "Avima/avima_products",
//           },
//         );
//         ((photoUrl = upload.secure_url), (photoId = upload.public_id));
//       }

//       const updateProducts = `
// UPDATE products SET
//   name = ?,
//   gender = ?,
//   description = ?,
//   price = ?,
//   discount = ?,
//   stock = ?,
//   slug = ?,
//   sizes = ?,
//   colors = ?,
//   brand = ?,
//   featured = ?,
//   status = ?,
//   photo = IFNULL(?,photo),
//   photoId = IFNULL(?,photoId),
//   discount_starts_at = ?,
//   discount_ends_at = ?,
//   categoryId = ?
// WHERE id = ?
// `;
//       dbConn.query(
//         updateProducts,
//         [
//           name,
//           gender,
//           description,
//           price,
//           discount,
//           stock,
//           slug,
//           sizes,
//           colors,
//           brand,
//           featured,
//           status,
//           photoUrl,
//           photoId,

//           discount_starts_at,
//           discount_ends_at,
//           Number(categoryId),
//           id,
//         ],
//         (err, data) => {
//           if (err) {
//             return res.status(500).json({
//               error: err.message,
//             });
//           }

//           return res.status(200).json({
//             msg: "Products updated successfully",
//           });
//         },
//       );
//     });
//   } catch (err) {
//     console.log("error");
//   }
// });

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

    const query = "SELECT * FROM products WHERE id=?";
    dbConn.query([id], async (err, data) => {
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
    });

    const row = "SELECT photos FROM products WHERE id =?";

    dbConn.query([id]);

    let oldPhotos = JSON.parse(row[0].photos || "[]");
    // console.log(oldPhotos);

    let finalPhoto = oldPhotos;

    if (req.files && req.files.photos) {
      // delete old photo

      for (let i = 0; i < oldPhotos.length; i++) {
        await cloudinary.uploader.destroy(oldPhotos[i].photoId);
      }

      // new upload

      let files = req.files.photos;
      if (!Array.isArray(files)) {
        files = [files];
      }
      let newPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const upload = await cloudinary.uploader.upload(files[i].tempFilePath, {
          folder: "Avima/products",
        });

        newPhotos.push({
          url: upload.secure_url,
          photoId: upload.public_id,
        });
        
      }
finalPhoto = newPhotos;

    }
    
 const queryProducts = `
      UPDATE products SET
        name=?,
        gender=?,
        description=?,
        price=?,
        discount=?,
        stock=?,
        slug=?,
        sizes=?,
        colors=?,
        brand=?,
        featured=?,
        status=?,
        photos=?,
        discount_starts_at=?,
        discount_ends_at=?,
        categoryId=?
      WHERE id=?
    `;

    dbConn.query(queryProducts, [
      name,
      gender,
      description,
      price,
      discount,
      stock,
      slug,
      JSON.stringify(sizes),
      JSON.stringify(colors),
      brand,
      featured,
      status,
      JSON.stringify(finalPhotos),
      discount_starts_at,
      discount_ends_at,
      Number(categoryId),
      id
    ]);

    res.json({
      msg: "Product updated successfully",
      photos: finalPhotos
    });
      
  } catch (err) {}
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
      error: err.message,
    });
  }
});

module.exports = route;
