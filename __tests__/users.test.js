require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
let adminToken = "";
let userToken = "";
let unverifiedToken = "";

// before all tests, reset the database (use on database tests only)
beforeAll(async () => {
	console.log = jest.fn();
	await resetDB();

	// generate tokens for the tests
	adminToken = await getToken("admin");
	userToken = await getToken("user");
	unverifiedToken = await getToken("unsigned");
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

		test("should respond with isLoggedUser true if the user is the logged user", async () => {
			const response = await supertest(app)
				.get("/api/users/2")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.data.isLoggedUser).toBe(true);
		});

		test("should respond with isLoggedUser false if the user is not the logged user", async () => {
			const response = await supertest(app)
				.get("/api/users/1")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.data.isLoggedUser).toBe(false);
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

describe("GET /api/users", () => {
	test("should respond with a 200 status code", async () => {
		const response = await supertest(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.statusCode).toBe(200);
	});

	test("should respond with a json", async () => {
		const response = await supertest(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.type).toBe("application/json");
	});

	test("should respond with a users array", async () => {
		const response = await supertest(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					email: expect.any(String),
					role: expect.any(String),
					school: expect.any(String),
				}),
			])
		);
	});

	test("should respond with a 403 status code if the user is not an admin", async () => {
		const response = await supertest(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${userToken}`);
		expect(response.statusCode).toBe(403);
	});

	test("should respond with a message if the user is not an admin", async () => {
		const response = await supertest(app)
			.get("/api/users")
			.set("Authorization", `Bearer ${userToken}`);
		expect(response.body.message).toBe("Require Admin Role!");
		expect(response.body.success).toBe(false);
	});

	test("should respond with a 401 status code if the user is not logged in", async () => {
		const response = await supertest(app).get("/api/users");

		expect(response.statusCode).toBe(401);
	});

	test("should respond with a message if the user is not logged in", async () => {
		const response = await supertest(app).get("/api/users");
		expect(response.body.message).toBe("Unauthorized!");
		expect(response.body.success).toBe(false);
	});
});

describe("GET /api/users/role", () => {
	test("should respond with a 200 status code", async () => {
		const response = await supertest(app)
			.get("/api/users/role")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.statusCode).toBe(200);
	});

	test("should respond with a json", async () => {
		const response = await supertest(app)
			.get("/api/users/role")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.type).toBe("application/json");
	});

	test("should respond with a roles array", async () => {
		const response = await supertest(app)
			.get("/api/users/role")
			.set("Authorization", `Bearer ${adminToken}`);
		expect(response.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					title: expect.any(String),
				}),
			])
		);
	});

	test("should respond with a 403 status code if the user is not an admin", async () => {
		const response = await supertest(app)
			.get("/api/users/role")
			.set("Authorization", `Bearer ${userToken}`);
		expect(response.statusCode).toBe(403);
	});

	test("should respond with a message if the user is not an admin", async () => {
		const response = await supertest(app)
			.get("/api/users/role")
			.set("Authorization", `Bearer ${userToken}`);
		expect(response.body.message).toBe("Require Admin Role!");
		expect(response.body.success).toBe(false);
	});

	test("should respond with a 401 status code if the user is not logged in", async () => {
		const response = await supertest(app).get("/api/users/role");

		expect(response.statusCode).toBe(401);
	});

	test("should respond with a message if the user is not logged in", async () => {
		const response = await supertest(app).get("/api/users/role");
		expect(response.body.message).toBe("Unauthorized!");
		expect(response.body.success).toBe(false);
	});
});

describe("POST /api/users/role", () => {
	describe("when the role is valid", () => {
		test("should respond with a 201 status code", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(201);

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role test added successfully.");

			// Delete the role
			await db.role.destroy({ where: { title: "test" } });
		});
	});

	describe("when the role is invalid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role can not be empty!");
			expect(response.body.success).toBe(false);
		});

		test("role should be a string", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: 1 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role must be a string!");
		});

		test("role should be valid", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "c4t L0L" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Invalid role name!");
		});

		test("role should not already exist", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "unsigned" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role unsigned already exists.");
		});
	});

	describe("when the user is not an admin", () => {
		test("should respond with a 403 status code", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(403);
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.post("/api/users/role")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.message).toBe("Require Admin Role!");
			expect(response.body.success).toBe(false);
		});
	});

	describe("when the user is not logged in", () => {
		test("should respond with a 401 status code", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "test" });
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/role").send({ role: "test" });
			expect(response.body.message).toBe("Unauthorized!");
			expect(response.body.success).toBe(false);
		});
	});
});

describe("PUT /api/users/role/:id", () => {
	describe("when the role exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(200);

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role updated successfully.");

			// change the role back to the previous value
			await db.role.update({ title: "unsigned" }, { where: { id: 1 } });
		});
	});

	describe("when the role does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app)
				.put("/api/users/role/0")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(404);
			expect(response.body.success).toBe(false);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.put("/api/users/role/0")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
			expect(response.body.success).toBe(false);
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.put("/api/users/role/0")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role with id 0 not found.");
			expect(response.body.success).toBe(false);
		});
	});

	describe("when the role is invalid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role can not be empty!");
			expect(response.body.success).toBe(false);
		});

		test("role should be a string", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: 1 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role must be a string!");
		});

		test("role should be valid", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "c4t L0L" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Invalid role name!");
		});

		test("role should not already exist", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "estudante" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(409);
			expect(response.body.message).toBe("Role estudante already exists.");
		});
	});

	describe("when the user is not authenticated", () => {
		test("should respond with a 401 status code", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).put("/api/users/role/1").send({ role: "test" });
			expect(response.body.message).toBe("Unauthorized!");
		});
	});

	describe("when the user is not an admin", () => {
		test("should respond with a 403 status code", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(403);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.put("/api/users/role/1")
				.send({ role: "test" })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.message).toBe("Require Admin Role!");
		});
	});
});

describe("PATCH /api/users/:id/role", () => {
	describe("when the user exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);

			console.log(response.body.message);

			expect(response.statusCode).toBe(200);

			// change the user role back to the previous value
			await db.users.update({ roleId: 2 }, { where: { id: 1 } });
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");

			// change the user role back to the previous value
			await db.users.update({ roleId: 2 }, { where: { id: 1 } });
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("User role updated successfully.");
			expect(response.body.success).toBe(true);

			// change the user role back to the previous value
			await db.users.update({ roleId: 2 }, { where: { id: 1 } });
		});
	});

	describe("when the user does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/0/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(404);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/0/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/0/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("User with id 0 not found.");
			expect(response.body.success).toBe(false);
		});
	});

	describe("when the role does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 0 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(404);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 0 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 0 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role with id 0 not found.");
			expect(response.body.success).toBe(false);
		});
	});

	describe("when the role id is invalid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: "test" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role id must be a number!");
			expect(response.body.success).toBe(false);
		});

		test("role id should not be empty", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: "" })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("Role id can not be empty!");
		});
	});

	describe("when the user is not authenticated", () => {
		test("should respond with a 401 status code", async () => {
			const response = await supertest(app).patch("/api/users/2/role").send({ roleId: 3 });
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).patch("/api/users/2/role").send({ roleId: 3 });
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).patch("/api/users/2/role").send({ roleId: 3 });
			expect(response.body.message).toBe("Unauthorized!");
		});
	});

	describe("when the user is not an admin", () => {
		test("should respond with a 403 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(403);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/2/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.message).toBe("Require Admin Role!");
		});
	});

	describe("when the user is trying to edit his own role", () => {
		test("should respond with a 403 status code", async () => {
			const response = await supertest(app)
				.patch("/api/users/1/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.statusCode).toBe(403);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app)
				.patch("/api/users/1/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.patch("/api/users/1/role")
				.send({ roleId: 3 })
				.set("Authorization", `Bearer ${adminToken}`);
			expect(response.body.message).toBe("You can't edit your own role.");
		});
	});
});

describe("POST /api/users/login", () => {
	describe("when the user exists", () => {
		test("should respond with a 200 status code", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.statusCode).toBe(200);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.type).toBe("application/json");
		});

		test("should respond with a token", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.body.data.auth_key).toBeDefined();
		});
	});

	describe("when the user does not exist", () => {
		test("should respond with a 404 status code", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "ave.maria@email.pt",
				password: "123",
			});
			expect(response.statusCode).toBe(404);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "ave.maria@email.pt",
				password: "123",
			});
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "ave.maria@email.pt",
				password: "123",
			});
			expect(response.body.message).toBe("User not found.");
		});
	});

	describe("when the password is wrong", () => {
		test("should respond with a 401 status code", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "123",
			});
			expect(response.statusCode).toBe(401);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "123",
			});

			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
				password: "123",
			});
			expect(response.body.message).toBe("Invalid password.");
		});
	});

	describe("when the email is not valid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "UserEsmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "UserEsmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "UserEsmad.ipp.pt",
				password: "Esmad_2223",
			});
			expect(response.body.message).toBe("Invalid email!");
		});
	});

	describe("when the password is not valid", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
			});
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a json", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
			});

			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app).post("/api/users/login").send({
				email: "User@esmad.ipp.pt",
			});
			expect(response.body.message).toBe("Password can not be empty!");
		});
	});
});

// After all tests have finished, close the DB connection
afterAll(async () => {
	await db.sequelize.close();
});
