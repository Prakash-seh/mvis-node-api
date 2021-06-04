const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const Schema = {
    name: Joi.string().min(5).max(15).required(),
    phone: Joi.string().min(5).max(15).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(customer, Schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
