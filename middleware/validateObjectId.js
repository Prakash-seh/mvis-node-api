const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  // added after genre endpoint integration testing
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send("Invalid Id");
  }
  next();
};
