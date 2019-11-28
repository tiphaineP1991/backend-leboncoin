const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../Models/User");

//ROUTE 1 POST

router.post("/signup", async (req, res) => {
  console.log("coucou");
  // res.send("coucou");

  try {
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);

    const newUser = new User({
      email: req.fields.email,
      token: token,
      salt: salt,
      hash: hash,
      account: {
        username: req.fields.username
      }
    });
    await newUser.save();
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
