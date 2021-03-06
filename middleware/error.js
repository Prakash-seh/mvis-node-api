const logger = require("./logger");

function error(err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("Something failed while parsing");
}

module.exports = error;
