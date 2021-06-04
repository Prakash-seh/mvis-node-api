const { genreSchema } = require("./genre");
const mongoose = require("mongoose");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    requried: true,
    min: 0,
    max: 100,
  },
  dailyRentalRate: {
    type: Number,
    requried: true,
    min: 0,
    max: 100,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(100).required(),
    dailyRentalRate: Joi.number().min(0).max(100).required(),
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
