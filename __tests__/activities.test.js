require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const colors = require("colors");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
const e = require("express");
let adminToken = "";
let userToken = "";
let unsignedToken = "";

beforeAll(async () => {
	// reset the database
	// await resetDB(false);
	// generate tokens for the tests
	adminToken = await getToken("admin", false);
	userToken = await getToken("user", false);
	unsignedToken = await getToken("unsigned", false);
}, 10000);

// GET activities
describe("GET /api/activities", () => {
	describe("when there is any parameter provided", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app).get("/api/activities");
			expect(response.statusCode).toBe(400);
		});

		test("should respond with JSON", async () => {
			const response = await supertest(app).get("/api/activities");
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).get("/api/activities");
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("provide parameters");
		});
	});
	// activities with search
	describe("when searching activities", () => {
		describe("when is a valid search", () => {
			test("should respond with a 200 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=Limpeza%20da%20Praia"
				);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=Limpeza%20da%20Praia"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=Limpeza%20da%20Praia"
				);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							id: 2,
							title: "Limpeza da Praia + separação de resíduos",
						}),
					])
				);
			});
		});
		describe("when search is empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?search=");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?search=");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?search=");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("search is empty");
			});
		});

		describe("when there is an invalid parameter instead of search", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?searchss=Limpeza%20da%20Praia"
				);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?searchss=Limpeza%20da%20Praia"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?searchss=Limpeza%20da%20Praia"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("searchss is an invalid parameter");
			});
		});

		describe("when there is no activities founded", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=hello%20da%20Praia%20aaaa"
				);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=hello%20da%20Praia%20aaaa"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?search=hello%20da%20Praia%20aaaa"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe(`no activities found with title hello da Praia aaaa`);
			});
		});
	});

	// recent activities
	describe("when getting recent activities", () => {
		describe("when is a valid request", () => {
			test("should respond with a 200 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=recent"
				);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=recent"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=recent"
				);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							id: expect.any(Number),
							is_finished: false,
							theme: expect.any(String),
							title: expect.any(String),
							initial_date: expect.any(String),
							final_date: expect.any(String),
							images: expect.any(String),
						}),
					])
				);
			});
		});
	});
});

afterAll(async () => {
	await resetDB(false);
	// close the db connectionclea
	await db.sequelize.close();
});
