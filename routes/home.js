const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //   res.send("home");
  res.render("index", { title: "mvis-node-api Homepage" });
});

module.exports = router;
