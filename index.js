// PERMETTRE AU SERVEUR DE COMM
require("dotenv").config();

// DEMARRER MON SERVEUR
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(formidableMiddleware());

app.use(cors());

// IMPORTER MES MODELS

require("./Models/User");
require("./Models/Product");

// IMPORTER MES ROUTES
const signupRoutes = require("./routes/signup");
app.use(signupRoutes);

const loginRoutes = require("./routes/login");
app.use(loginRoutes);

const publishRoutes = require("./routes/publish");
app.use(publishRoutes);

const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

// Configurer Cloudinary

// CONNECTER MA BDD
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ECOUTER MON SERVEUR
app.listen(4000, () => {
  console.log("Server started");
});
