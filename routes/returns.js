const Joi = require("joi");
const { Rental } = require("../models/rental");
const express = require("express");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("Rental is already processed");

  rental.return();
  await rental.save();

  const movie = await Movie.findById(req.body.movieId);
  movie.numberInStock = movie.numberInStock + 1;
  await movie.save();
  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
