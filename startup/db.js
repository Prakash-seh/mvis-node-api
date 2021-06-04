const mongoose = require("mongoose");
const logger = require("../middleware/logger");

//.catch(err) handled by global error handler
module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://mvis_user:Qwerty@123@mvis-node-api-cluster.7smzb.mongodb.net/mvis",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .then(() => logger.info("Connected to db"));
};
