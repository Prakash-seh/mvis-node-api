const moment = require("moment");
const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        trim: true,
      },
      dailyRentalRate: {
        type: Number,
        requried: true,
        min: 0,
        max: 100,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  this.rentalFee =
    moment().diff(this.dateOut, "days") * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
