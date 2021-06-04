const mongoose = require("mongoose");
const request = require("supertest");
const { Customer } = require("../../../models/customer");
let server;

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Customer.remove({});
  });

  describe("Get /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        { name: "customer1", phone: "123456", isGold: false },
        { name: "customer2", phone: "123456", isGold: true },
      ]);
      const res = await request(server).get("/api/customers");
      expect(res.status).toBe(200);
      expect(res.body.some((c) => c.name == "customer1")).toBeTruthy();
      expect(res.body.some((c) => c.name == "customer2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    // it("should return 404 if invalid id is passed", async () => {
    //   const res = await request(server).get("/api/customers/1");
    //   expect(res.status).toBe(404);
    // });

    it("should return 404 if no customer with given id exists", async () => {
      const customerId = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/customers/" + customerId);
      expect(res.status).toBe(404);
    });

    it("should return customer if valid id is passed", async () => {
      const customer = new Customer({ name: "customer1", phone: "123456" });
      await customer.save();
      const res = await request(server).get("/api/customers/" + customer._id);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: customer.name,
        phone: customer.phone,
      });
    });
  });

  describe("post /", () => {
    let name;
    let phone;

    const exec = async () => {
      return request(server).post("/api/customers/").send({
        name: name,
        phone: phone,
      });
    };

    beforeEach(() => {
      name = "customer1";
      phone = "123456";
    });

    it("should return 400 if customer name is shorter than 5 char", async () => {
      name = "cust";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if phone number is shorter than 5 char", async () => {
      phone = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if customer name is larger than 15 char", async () => {
      name = new Array(17).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if customer phone number is larger than 15 char", async () => {
      phone = new Array(17).join("1");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the customer if it is valid", async () => {
      await exec();
      const customer = await Customer.find({
        name: "customer1",
        phone: "123456",
      });
      expect(customer).not.toBeNull();
    });

    it("should return the customer if it is valid", async () => {
      const res = await exec();
      expect(res.body).toMatchObject({ name: name, phone: phone });
    });
  });

  describe("put /:id", () => {
    let customerId;
    let newName;
    let newPhone;

    const exec = () => {
      return request(server)
        .put("/api/customers/" + customerId)
        .send({
          name: newName,
          phone: newPhone,
        });
    };

    beforeEach(async () => {
      customer = new Customer({ name: "customer1", phone: "123456" });
      await customer.save();
      customerId = customer._id;
      newName = "updated name";
      newPhone = "updated phone";
    });

    it("should return 400 if customer name is less than 5 character", async () => {
      newName = "cust";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if customer phone is less than 5 character", async () => {
      newPhone = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if customer name is more than 15 character", async () => {
      newName = new Array(17).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if customer phone is more than 15 character", async () => {
      newPhone = new Array(17).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      customerId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if customer with given id is not found", async () => {
      customerId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the customer if input is valid", async () => {
      await exec();
      const updateCustomer = await Customer.findById(customerId);
      expect(updateCustomer.name).toBe(newName);
    });

    it("should return the updated customer if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
      expect(res.body).toHaveProperty("phone", newPhone);
    });
  });

  describe("delete /:id", () => {
    let customer;
    let customerId;
    beforeEach(async () => {
      customer = new Customer({ name: "customer1", phone: "123456" });
      await customer.save();
      customerId = customer._id;
    });

    const exec = () => {
      return request(server).delete("/api/customers/" + customerId);
    };

    it("should return 404 if id is invaid", async () => {
      customerId = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if customer with given id is not found", async () => {
      customerId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should remove the customer if id is valid", async () => {
      await exec();
      const customer = await Customer.findById(customerId);
      expect(customer).toBeNull();
    });

    it("should return the customer if id is valid", async () => {
      const res = await exec();
      expect(res.body).toMatchObject({
        _id: customerId.toHexString(),
        name: customer.name,
      });
    });
  });
});
