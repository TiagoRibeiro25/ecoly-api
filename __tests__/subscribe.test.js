require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const NewsLetter = db.news_letter;
const validateEmail = require("../utils/validateEmail");

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

describe("POST /api/subscribe", () => {
  test("should subscribe a new email", async () => {
    const email = "test@example.com";
  
    // Validate the email format before making the request
    expect(validateEmail(email)).toBe(true);
  
    const response = await supertest(app)
      .post("/api/subscribe")
      .send({ email });
  
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain(email);
  
    // Check if the email exists in the database
    const subscriber = await NewsLetter.findOne({ where: { email } });
    expect(subscriber).toBeNull();
  });

  test("should return 400 if email is invalid", async () => {
    const email = "invalid-email";

    // Validate the email format before making the request
    expect(validateEmail(email)).toBe(false);

    const response = await supertest(app)
      .post("/api/subscribe")
      .send({ email });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email format");
  });

  test("should return 409 if email is already subscribed", async () => {
    const email = "josepprn@gmail.com";

    const response = await supertest(app)
      .post("/api/subscribe")
      .send({ email });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email already subscribed");
  });
})

describe("DELETE /api/subscribe", () => {
  test("should remove the subscription", async () => {
    const email = "josepprn@gmail.com";

    // Find the email to be deleted
    const subscriber = await NewsLetter.findOne({ where: { email } });

    expect(subscriber).not.toBeNull();

    const response = await supertest(app).delete(`/api/subscribe/${subscriber.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Email deleted successfully");

    // Check if the email was deleted
    const deletedSubscriber = await NewsLetter.findByPk(subscriber.id);
    expect(deletedSubscriber).toBeNull();
  });

  test("should return 404 if email not found", async () => {
    const nonExistentId = 123456;

    const response = await supertest(app).delete(`/api/subscribe/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email not found");
  });
})
