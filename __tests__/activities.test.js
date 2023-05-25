require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
let adminToken = "";
let userToken = "";
let unsignedToken = "";

// before all tests, reset the database (use on database tests only)
beforeAll(async () => {
	await resetDB(false);

	// generate tokens for the tests
	adminToken = await getToken("admin", false);
	userToken = await getToken("user", false);
	unsignedToken = await getToken("unsigned", false);
}, 10000);

// create activity tests (POST)
describe("POST /api/activities", () => {
	describe("when is an invalid route", () => {
		test("should return 404 status code", async () => {
			const response = await supertest(app).post("/api/activities/invalid");
			expect(response.statusCode).toBe(404);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/activities/invalid");
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app).post("/api/activities/invalid");
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Invalid route");
		});
	});
	describe("when the fields parameter is empty", () => {
		test("should return 400 status code", async () => {
			const response = await supertest(app).post("/api/activities?fields=");
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/activities?fields=");
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app).post("/api/activities?fields=");
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("fields is empty");
		});
	});
	describe("when the fields parameter is invalid", () => {
		test("should return 400 status code", async () => {
			const response = await supertest(app).post("/api/activities?fields=invalid");
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/activities?fields=invalid");
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app).post("/api/activities?fields=invalid");
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("invalid is an invalid value for the fields parameter");
		});
	});
	describe("when is a invalid parameter", () => {
		test("should return 400 status code", async () => {
			const response = await supertest(app).post("/api/activities?invalid=activity");
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/activities?invalid=activity");
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app).post("/api/activities?invalid=activity");
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("invalid is an invalid parameter");
		});
	});

	describe("when the url is valid but there is no user logged in", () => {
		test("should return 401 status code", async () => {
			const response = await supertest(app).post("/api/activities?fields=activity");
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/activities?fields=activity");
			expect(response.type).toBe("application/json");
		});
		test("should return the error message", async () => {
			const response = await supertest(app).post("/api/activities?fields=activity");
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Unauthorized!");
		});
	});

	describe("when the url is valid but the logged user is not verified", () => {
		test("should return 403 status code", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${unsignedToken}`);
			expect(response.statusCode).toBe(403);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${unsignedToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${unsignedToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Require Verified Role!");
		});
	});

	describe("when the logged user is verified but the token expired", () => {
		test("should return 401 status code", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Unauthorized!");
		});
	});

	describe("When the token is valid but the body is empty", () => {
		test("should return 400 status code", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("body is empty");
		});
	});

	// null errors
	describe("when the body is not empty but is missing required keys", () => {
		test("should return 400 status code", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ theme_id: 3 });
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ theme_id: 3 });
			expect(response.type).toBe("application/json");
		});

		test("should return the error message", async () => {
			const response = await supertest(app)
				.post("/api/activities?fields=activity")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ theme_id: 3 });
			expect(response.body.success).toBe(false);
			expect(response.body.error).toEqual([
				"title cannot be null",
				"complexity cannot be null",
				"initial_date cannot be null",
				"final_date cannot be null",
				"objective cannot be null",
				"diagnostic cannot be null",
				"meta cannot be null",
				"resources cannot be null",
				"participants cannot be null",
				"evaluation_indicator cannot be null",
				"evaluation_method cannot be null",
				"images cannot be null",
			]);
		});
	});

	// ... more to be done
});

