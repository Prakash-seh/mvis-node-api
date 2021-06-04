require("dotenv").config();
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateToken();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject(payload);
  });
});
