const mongoose = require("mongoose");
const logger = require("../middleware/logger");

//.catch(err) handled by global error handler
module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/mvis", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => logger.info("Connected to db"));
};
