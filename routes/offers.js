const express = require("express");
const router = express.Router();

const Product = require("../Models/Product");
const User = require("../Models/User");

router.get("/offers/with-count", async (req, res) => {
  try {
    const object = {};
    const products = await Product.find();

    let count = null;
    for (let i = 0; i < products.length; i++) {
      count = count + 1;
    }

    object.count = count;
    object.offers = products;
    res.json(object);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
