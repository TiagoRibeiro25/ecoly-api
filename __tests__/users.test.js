require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const resetDB = require("../data/resetDB");

// before all tests, reset the database (use on database tests only)
beforeAll(async () => {
	console.log = jest.fn();
	await resetDB();
});

describe("GET /api/users/:id", () => {
	describe("when the user exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await supertest(app).get("/api/users/1");
			expect(response.statusCode).toBe(200);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).get("/api/users/1");
			expect(response.type).toBe("application/json");
		});

		test("should respond with a user object", async () => {
			const response = await supertest(app).get("/api/users/1");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					email: expect.any(String),
					name: expect.any(String),
					photo: expect.any(String),
					isLoggedUser: expect.any(Boolean),
					role: expect.any(String),
					school: expect.any(String),
					seeds: expect.any(Object),
					badges: expect.any(Object),
				})
			);
		});
	});

	describe("when the user does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app).get("/api/users/0");
			expect(response.statusCode).toBe(404);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).get("/api/users/0");
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).get("/api/users/0");
			expect(response.body.message).toBe("User with id 0 not found.");
		});
	});
});

// After all tests have finished, close the DB connection
afterAll(async () => {
	await db.sequelize.close();
});
