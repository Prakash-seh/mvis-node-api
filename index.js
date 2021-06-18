require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("./middleware/logger");

require("./startup/engine")(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, (req, res) => {
  logger.info("Listening on port " + port);
});

module.exports = server;
