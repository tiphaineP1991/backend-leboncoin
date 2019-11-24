const express = require("express");
const router = express.Router();

const Product = require("../Models/Product");
const User = require("../Models/User");

router.get("/offer/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const product = await Product.findById(req.params.id).populate({
      path: "user",
      select: "account"
    });
    res.json(product);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
