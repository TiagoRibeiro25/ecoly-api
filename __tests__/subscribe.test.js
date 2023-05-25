require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");

describe("GET /api/subscribe", () => {
    test("should return 200 if user is subscribed", async () => {

        const user = await Users.findOne({ where: { email: "josepprn@gmail.com" } });
        if (!user) {
            throw new Error("User not found");
        }

        const response = await supertest(app).get("/api/subscribe");

        expect(response.statusCode).toBe(200);
    });
    
    test("should return 404 if user is not subscribed", async () => {
        const user = await Users.findOne({ where: { email: "thisDoesNotExist@gmail.com" } });
        if (!user) {
            throw new Error("User not found");
        }
        const response = await supertest(app).get("/api/subscribe");
        expect(response.statusCode).toBe(404);
    })
});
