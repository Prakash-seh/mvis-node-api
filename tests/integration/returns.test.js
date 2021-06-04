const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");

describe("/api/returns", () => {
  let server;
  let rental;
  let customerId;
  let movieId;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId: customerId, movieId: movieId });
  };

  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    server = require("../../index");
    movie = new Movie({
      _id: movieId,
      title: "12345",
      genre: { name: "genre1" },
      dailyRentalRate: 1,
      numberInStock: 10,
    });
    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "customer1",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie1",
        dailyRentalRate: 1,
      },
    });
    await rental.save();
    token = new User().generateToken();
  });

  afterEach(async () => {
    server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("should return 401 if user in not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customer id is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movie id is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rentals is found for customerId or movieId", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if rental is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the returned date if input is valid", async () => {
    const res = await exec();
    const rentalIndb = await Rental.findById(rental._id);
    const diff = new Date() - rentalIndb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalIndb = await Rental.findById(rental._id);
    expect(rentalIndb.rentalFee).toBe(7);
  });

  it("should increase the number in stock for given movie", async () => {
    const res = await exec();
    const movieIndb = await Movie.findById(movieId);
    expect(movieIndb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if it is valid", async () => {
    const res = await exec();
    const rentalIndb = await Rental.findById(rental._id);
    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    // expect(res.body).toHaveProperty("movie");
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
