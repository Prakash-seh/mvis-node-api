const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("Get /", () => {
    it("should return all genre", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      //   expect(res.body.length).toBe(5);
      expect(res.body.some((g) => g.name == "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name == "genre2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    it("should return genre if valid id is passed", async () => {
      const genre = new Genre({ name: "orange" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: genre.name });
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if no genre with given id exists", async () => {
      const genreId = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + genreId);
      expect(res.status).toBe(404);
    });
  });

  describe("post /", () => {
    //              .......clean code technique.......
    // extract happy path, and alter that happy path at each level with few changes

    // extracting parameters which changes at the start of each test
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });
    };

    // generating token before each test
    beforeEach(() => {
      token = new User().generateToken();
    });

    // test starts
    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is shorter than 5 char", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is greater than 50 char", async () => {
      name = new Array(52).join("a"); //create string of length 51
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      // happy path original location
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      name = "genre1";

      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("put /:id", () => {
    let genre;
    let genreId;
    let newName;

    const exec = () => {
      return request(server)
        .put("/api/genres/" + genreId)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;
      newName = "updated name";
    });

    it("should return 400 if genre new name is less than 5 characters", async () => {
      newName = "123";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre new name is more than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      genreId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with given id is not found", async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();
      const updateGenre = await Genre.findById(genreId);
      expect(updateGenre.name).toBe(newName);
    });

    it("should return updated genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("delete /:id", () => {
    let genre;
    let genreId;
    let token;

    const exec = () => {
      return request(server)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;
      token = new User({ isAdmin: true }).generateToken();
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      genreId = "1";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with given id is not found", async () => {
      genreId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should remove the genre if input is valid", async () => {
      await exec();
      const genreInDb = await Genre.findById(genreId);
      expect(genreInDb).toBeNull();
    });

    it("should return deleted genre if id is valid", async () => {
      const res = await exec();
      expect(res.body).toMatchObject({
        _id: genreId.toHexString(),
        name: genre.name,
      });
    });
  });
});
