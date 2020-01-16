const express = require("express");
const router = express.Router();

const Product = require("../Models/Product");
const User = require("../Models/User");

const createFilters = req => {
  const filters = {};
  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }
  if (req.query.minPrice) {
    filters.price = {};
    filters.price = { $gte: req.query.minPrice };
  }
  if (req.query.maxPrice) {
    if (filters.price === undefined) {
      filters.price = {};
    }
    filters.price = { $lte: req.query.maxPrice };
  }
  return filters;
};

router.get("/offers/with-count?", async (req, res) => {
  try {
    // Dans la route get, on appelle la fonction
    // Dans notre recherche find(), on envoie l'objet (qui fonctionne avec la fonction)
    let list = {};
    const filters = createFilters(req);

    let offers = Product.find(filters);

    let length = Product.find(filters);

    // Puis pour trier par ordre croissant ou décroissant : il faut écrire les deux possibilités avec des conditions. Attention quand on trie, on enleve le AWAIT de la fonction
    if (req.query.sort) {
      if (req.query.sort === "price-asc") {
        offers.sort({ price: 1 });
      }
      if (req.query.sort === "price-desc") {
        offers.sort({ price: -1 });
      }
    }

    // Puis on gère la pagination
    if (req.query.skip) {
      const result = req.query.skip;
      const limit = 10;
      offers.limit(limit);
      offers.skip(limit * (result - 1));
    }

    const data = await length;
    list.count = data.length;

    list.offers = await offers;
    res.json(list);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
