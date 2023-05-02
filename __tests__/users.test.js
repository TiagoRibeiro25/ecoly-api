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
			expect(response.body.success).toBe(false);
		});
	});
});

describe("POST /api/users/role", () => {
	describe("when the role is valid", () => {
		test("should respond with a 201 status code", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "test" });
			expect(response.statusCode).toBe(201);

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "test" });
			expect(response.type).toBe("application/json");

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "test" });
			expect(response.body.message).toBe("Role test added successfully.");

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});
	});

	describe("when the role is invalid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "" });
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "" });
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "" });
			expect(response.body.message).toBe("Role can not be empty!");
			expect(response.body.success).toBe(false);
		});

		test("role should be a string", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: 1 });
			expect(response.body.message).toBe("Role must be a string!");
		});

		test("role should be valid", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "c4t L0L" });
			expect(response.body.message).toBe("Invalid role name!");
		});

		test("role should not already exist", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "unsigned" });
			expect(response.body.message).toBe("Role unsigned already exists.");
		});
	});
});

describe("PUT /api/users/role/:id", () => {
	describe("when the role exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.statusCode).toBe(200);

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.type).toBe("application/json");

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.body.message).toBe("Role updated successfully.");

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});
	});

	describe("when the role does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app).put("/api/users/role/0").send({ role: "test" });
			expect(response.statusCode).toBe(404);
			expect(response.body.success).toBe(false);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).put("/api/users/role/0").send({ role: "test" });
			expect(response.type).toBe("application/json");
			expect(response.body.success).toBe(false);
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).put("/api/users/role/0").send({ role: "test" });
			expect(response.body.message).toBe("Role with id 0 not found.");
			expect(response.body.success).toBe(false);
		});
	});

	describe("when the role is invalid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "" });
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "" });
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "" });
			expect(response.body.message).toBe("Role can not be empty!");
			expect(response.body.success).toBe(false);
		});

		test("role should be a string", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: 1 });
			expect(response.body.message).toBe("Role must be a string!");
		});

		test("role should be valid", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "c4t L0L" });
			expect(response.body.message).toBe("Invalid role name!");
		});

		test("role should not already exist", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "estudante" });
			expect(response.statusCode).toBe(409);
			expect(response.body.message).toBe("Role estudante already exists.");
		});
	});
});

// After all tests have finished, close the DB connection
afterAll(async () => {
	await db.sequelize.close();
});
