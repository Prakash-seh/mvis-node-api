require("express-async-errors");
const logger = require("../middleware/logger");

module.exports = function () {
  //handle express uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.info("We handled the exception");
    logger.error(err.message);
  });

  // sync exception
  // throw new Error("something went wrong");

  // async exception
  // const p = Promise.reject(new Error("something went wrong miserably"));
  // p.then(() => console.log("Done"));
};
