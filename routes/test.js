const express = require("express");
const router = express.Router();

//ROUTE 1 POST

router.get("/", async (req, res) => {
  try {
    res.json("hello");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
