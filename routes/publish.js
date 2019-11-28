const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const User = require("../Models/User");
const Product = require("../Models/Product");

router.post("/publish", async (req, res) => {
  try {
    const authentication = req.headers.authorization;
    if (!authentication) {
      res.status(400).json({ error: "User non connecté" });
      return;
    }

    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        error: "Invalid Authorization Header"
      });
      return;
    }
    const token = parts[1];

    const user = await User.findOne({ token: token });
    if (!user) {
      res.status(400).json({ error: "User n'existe pas'" });
      return;
    }
    console.log("user:", user);
    console.log("req.files ===>", req.files);
    const files = Object.keys(req.files);
    if (files.length) {
      const results = {};
      files.forEach(fileKey => {
        console.log("file path ====>", req.files[fileKey].path);
        cloudinary.v2.uploader.upload(
          req.files[fileKey].path,
          {
            folder: "leboncoin"
          },
          (error, result) => {
            if (error) {
              console.log("coucou ici");

              results[fileKey] = {
                success: false,
                error: error
              };
            } else {
              console.log("coucou là-bas");
              results[fileKey] = {
                success: true,
                result: result
              };
            }
            console.log("files.length ===>", files.length);
            console.log(
              "Object.keys(results).length  ===>",
              Object.keys(results).length
            );
            if (Object.keys(results).length === files.length) {
              console.log(results);
              const newProduct = new Product({
                title: req.fields.title,
                description: req.fields.description,
                price: req.fields.price,
                created: new Date(),
                files: results.files.result.secure_url,
                user: user
              });

              newProduct.save();
              return res.json({
                _id: newProduct._id,
                title: newProduct.title,
                description: newProduct.description,
                price: newProduct.price,
                files: newProduct.files,
                user: {
                  account: newProduct.user.account,
                  _id: newProduct.user._id
                }
              });
            }
          }
        );
      });
    } else {
      console.log("No file uploaded ! ");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
