const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return res.status(400).send("Invalid password");

  const token = user.generateToken();
  res.send(token);
});

function validate(auth) {
  const Schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required(),
  };
  return Joi.validate(auth, Schema);
}

module.exports = router;
