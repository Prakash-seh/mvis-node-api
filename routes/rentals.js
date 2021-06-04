const Joi = require("joi");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort({ dateOut: 1 });
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Movie not found");

  const rental = new Rental({
    customer: customer,
    movie: movie,
  });
  const result = await rental.save();
  res.send(result);
});

module.exports = router;
