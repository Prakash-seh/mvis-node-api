require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("./middleware/logger");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const server = app.listen(3000, (req, res) => {
  logger.info("Listening on server 3000...");
});

module.exports = server;
