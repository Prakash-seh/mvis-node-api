const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const Joi = require("joi");
const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort({ name: 1 });
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given id is not found");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  const result = await customer.save();
  res.send(result);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with given id is not found");

  res.send(customer);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given id is not found");
  res.send(customer);
});

module.exports = router;
