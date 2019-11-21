const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formidableMiddleware = require("express-formidable");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(4000, () => {
  console.log("Server started");
});
