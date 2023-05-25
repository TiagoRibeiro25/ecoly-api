require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");

describe("GET /api/subscribe", () => {
    test("should return 200 if user is subscribed", async () => {
      const email = "josepprn@gmail.com";
  
      const subscriber = await NewsLetter.findOne({ where: { email } });
  
      if (!subscriber) {
        throw new Error(`User with email ${email} is not subscribed`);
      }
  
      const response = await supertest(app).get("/api/subscribe");
  
      expect(response.statusCode).toBe(200);
    });
  
    test("should return 404 if user is not subscribed", async () => {
      const email = "thisDoesNotExist@gmail.com";
  
      const subscriber = await NewsLetter.findOne({ where: { email } });
  
      if (subscriber) {
        throw new Error(`User with email ${email} is subscribed`);
      }
  
      const response = await supertest(app).get("/api/subscribe");
  
      expect(response.statusCode).toBe(404);
    });
  });
  
