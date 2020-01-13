const express = require("express");
const router = express.Router();

const Product = require("../Models/Product");
const User = require("../Models/User");

router.get("/offers/with-count", async (req, res) => {
  try {
    const createFilters = req => {
      const filters = {};
      if (req.query.searchMinPrice) {
        filters.price = {};
        filters.price.$gte = req.query.searchMinPrice;
      }
      if (req.query.searchMaxPrice) {
        if (filters.price === undefined) {
          filters.price = {};
        }
        filters.price.$lte = req.query.searchMaxPrice;
      }
      if (req.query.searchTitle) {
        filters.searchTitle = new RegExp(req.query.search, "i");
      }
      return filters;
    };
    const filters = createFilters(req);
    const search = Offer.find(filters);

    // Here we sort the array by price
    if (req.query.sort === "price-asc") {
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      search.sort({ price: -1 });
    }

    // Here we deal with the pagination
    if (req.query.limit) {
      search.skip(Number(req.query.skip)).limit(Number(req.query.limit));
    }
    const offers = await search;
    const count = await Offer.find(); // To get the total number of offer (for pagination)
    res.json({ count: count.length, offers: offers });
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
