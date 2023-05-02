require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");

describe("GET /api", () => {
	it("should return 200 OK", async () => {
		const res = await supertest(app).get("/api");
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe("Welcome to the Ecoly API");
	});
});

describe("GET /api/invalid", () => {
	it("should return 404 Not found", async () => {
		const res = await supertest(app).get("/api/invalid");
		expect(res.status).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Invalid route");
	});
});
