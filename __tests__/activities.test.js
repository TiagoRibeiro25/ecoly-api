require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
let adminToken = "";
let userToken = "";
let unsignedToken = "";

beforeAll(async () => {
	// reset the database
	await resetDB(false);
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
				expect(response.body.data.length).toBe(3);
			});
		});
		describe("when is an invalid parameter instead of fields", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filter=recent"
				);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filter=recent"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filter=recent"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("fieldss is an invalid parameter");
			});
		});

		describe("when fields is empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=recent");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=recent");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=recent");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("fields is empty");
			});
		});

		describe("when fields haves an invalid value", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=recent");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=recent");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=recent");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("hello is an invalid value for the fields parameter");
			});
		});

		describe("when is an invalid parameter instead of filter", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filterss=recent"
				);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filterss=recent"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filterss=recent"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("filterss is an invalid parameter");
			});
		});

		describe("when filter is empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities&filter=");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities&filter=");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities&filter=");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("filter is empty");
			});
		});

		describe("when filter haves an invalid value", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=hello"
				);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=hello"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=hello"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("hello is an invalid value for the filter parameter");
			});
		});

		describe("when there are invalid parameters instead of fields and filter", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filterss=recent"
				);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filterss=recent"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fieldss=activities&filterss=recent"
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toEqual(
					expect.arrayContaining([
						"fieldss is an invalid parameter",
						"filterss is an invalid parameter",
					])
				);
			});
		});

		describe("when fields and filter are empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=&filter=");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toEqual(
					expect.arrayContaining(["fields is empty", "filter is empty"])
				);
			});
		});

		describe("when missing parameters filter or school", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=activities");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("Missing parameters filter or school");
			});
		});

		describe("when fields and filter are invalid", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=hello");
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=hello");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/activities?fields=hello&filter=hello");
				expect(response.body.success).toBe(false);
				expect(response.body.error).toEqual(
					expect.arrayContaining([
						"hello is an invalid value for the fields parameter",
						"hello is an invalid value for the filter parameter",
					])
				);
			});
		});
	});

	// get unfinished activities
	describe("when getting unfinished activities", () => {
		describe("when is a valid request with no logged user", () => {
			const unfinishedActivities = [];

			beforeAll(async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=unfinished"
				);
				unfinishedActivities.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=unfinished"
				);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=unfinished"
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					"/api/activities?fields=activities&filter=unfinished"
				);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(unfinishedActivities);
			});
		});

		describe("when is a valid request with a logged user", () => {
			describe("when is verified user", () => {
				const unfinishedActivities = [];

				beforeAll(async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${userToken}`);
					unfinishedActivities.push(...response.body.data);
				});

				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${userToken}`);

					expect(response.statusCode).toBe(200);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.isUserVerified).toBe(true);
					expect(response.body.data).toEqual(unfinishedActivities);
				});
			});

			describe("when is not verified user", () => {
				const unfinishedActivities = [];

				beforeAll(async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${unsignedToken}`);
					unfinishedActivities.push(...response.body.data);
				});

				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${unsignedToken}`);

					expect(response.statusCode).toBe(200);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${unsignedToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished")
						.set("Authorization", `Bearer ${unsignedToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.isUserVerified).toBe(false);
					expect(response.body.data).toEqual(unfinishedActivities);
				});
			});
		});
	});

	// get unfinished activities by school
	describe("when getting unfinished activities by school", () => {
		describe("when is a valid request with no logged user", () => {
			const unfinishedActivities = [];

			beforeAll(async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=esmad`
				);
				unfinishedActivities.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=esmad`
				);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=esmad`
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=esmad`
				);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(unfinishedActivities);
			});
		});

		describe("when is a valid request with a logged user", () => {
			describe("when is verified user", () => {
				const unfinishedActivities = [];

				beforeAll(async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${userToken}`);
					unfinishedActivities.push(...response.body.data);
				});

				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${userToken}`);

					expect(response.statusCode).toBe(200);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.isUserVerified).toBe(true);
					expect(response.body.data).toEqual(unfinishedActivities);
				});
			});

			describe("when is not verified user", () => {
				const unfinishedActivities = [];

				beforeAll(async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${unsignedToken}`);
					unfinishedActivities.push(...response.body.data);
				});

				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${unsignedToken}`);

					expect(response.statusCode).toBe(200);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${unsignedToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/activities?fields=activities&filter=unfinished&school=esmad")
						.set("Authorization", `Bearer ${unsignedToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.isUserVerified).toBe(false);
					expect(response.body.data).toEqual(unfinishedActivities);
				});
			});
		});

		describe("when is an invalid request", () => {
			describe("when haves a invalid parameter instead of school", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app).get(
						`/api/activities?fields=activities&filter=unfinished&schoolss=esmad`
					);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app).get(
						`/api/activities?fields=activities&filter=unfinished&schoolss=esmad`
					);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app).get(
						`/api/activities?fields=activities&filter=unfinished&schoolss=esmad`
					);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("schoolss is an invalid parameter");
				});
			});

			describe("when haves invalid parameters instead of fields filter and school", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app).get(
						`/api/activities?fieldss=activities&filterss=unfinished&schoolss=esmad`
					);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app).get(
						`/api/activities?fieldss=activities&filterss=unfinished&schoolss=esmad`
					);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app).get(
						`/api/activities?fieldss=activities&filterss=unfinished&schoolss=esmad`
					);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toEqual([
						"fieldss is an invalid parameter",
						"filterss is an invalid parameter",
						"schoolss is an invalid parameter",
					]);
				});
			});

			describe("when all the paramers are empty", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app).get(`/api/activities?fields=&filter=&school=`);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app).get(`/api/activities?fields=&filter=&school=`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app).get(`/api/activities?fields=&filter=&school=`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toEqual([
						"fields is empty",
						"filter is empty",
						"school is empty",
					]);
				});
			});
		});

		describe("when the school is not found", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=sdaasd`
				);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=sdaasd`
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=unfinished&school=sdaasd`
				);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("School not found.");
			});
		});
	});

	// get report activity
	describe("when getting a report activity", () => {
		describe("when is verified user logged in", () => {
			let report = {};

			beforeAll(async () => {
				const response = await supertest(app)
					.get("/api/activities/5?fields=report")
					.set("Authorization", `Bearer ${userToken}`);
				report = response.body.data;
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(report);
			});
		});

		describe("when is not verified user logged in", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/5?fields=report`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is no user logged in", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get(`/api/activities/5?fields=report`);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities/5?fields=report`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities/5?fields=report`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when the activity is not finished yet", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/3?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/3?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/3?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("Activity is not finished yet.");
			});
		});

		describe("when the activity is not found", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/100?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/100?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/100?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("Activity not found.");
			});
		});

		describe("when there is an invalid id", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/asd?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/asd?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/asd?fields=report`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("Invalid id");
			});
		});
	});

	// get finished activities
	describe("when getting finished activities", () => {
		describe("when is a logged in verified user", () => {
			const finishedActivities = [];

			beforeAll(async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${userToken}`);
				finishedActivities.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(finishedActivities);
			});
		});

		describe("when is a logged in not verified user", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished`
				);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished`
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished`
				);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});
	});

	// get finished activities by year
	describe("when getting finished activities by year", () => {
		describe("when is a logged in verified user", () => {
			const finishedActivities = [];

			beforeAll(async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				finishedActivities.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(finishedActivities);
			});
		});

		describe("when is a logged in not verified user", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=2023`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished&year=2023`
				);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished&year=2023`
				);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(
					`/api/activities?fields=activities&filter=finished&year=2023`
				);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when year is not a number", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=notANumber`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=notANumber`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=notANumber`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("Year must be a number.");
			});
		});

		describe("when the year is empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&year=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("year is empty");
			});
		});

		describe("when haves an invalid parameter instead year", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&yeadsa=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&yeadsa=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=activities&filter=finished&yeadsa=2023`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("yeadsa is an invalid parameter");
			});
		});
	});

	// get themes
	describe("when getting themes", () => {
		describe("when is a logged in verified user", () => {
			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							id: expect.any(Number),
							name: expect.any(String),
						}),
					])
				);
			});
		});

		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get(`/api/activities?fields=themes`);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities?fields=themes`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities?fields=themes`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is a logged user but is not verified", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=themes`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when fields haves an invalid value", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=thesdame`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=thesdame`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities?fields=thesdame`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe(
					"thesdame is an invalid value for the fields parameter"
				);
			});
		});
	});

	// get one activity details
	describe("when getting one activity details", () => {
		describe("when there is no logged user", () => {
			let activity = {};

			beforeAll(async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				activity = response.body.data;
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				expect(response.body.success).toBe(true);
				expect(response.body.canUserEdit).toBe(false);
				expect(response.body.data).toEqual(activity);
			});
		});

		describe("when there is a logged verified user", () => {
			let activity = {};

			beforeAll(async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				activity = response.body.data;
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.isUserVerified).toBe(true);
				expect(response.body.canUserEdit).toBe(true);
				expect(response.body.data).toEqual(activity);
			});
		});

		describe("when there is a logged not verified user", () => {
			let activity = {};

			beforeAll(async () => {
				const response = await supertest(app).get(`/api/activities/1`);
				activity = response.body.data;
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.isUserVerified).toBe(false);
				expect(response.body.canUserEdit).toBe(false);
				expect(response.body.data).toEqual(activity);
			});
		});

		describe("when is not a valid activity id", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app).get(`/api/activities/adas`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities/adas`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities/adas`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("invalid id");
			});
		});

		describe("when not found activity", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app).get(`/api/activities/999`);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities/999`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities/999`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("activity with id 999 not found");
			});
		});

		describe("when finding an activity finished", () => {
			test("should respond with a 404 status code", async () => {
				const response = await supertest(app).get(`/api/activities/4`);
				expect(response.statusCode).toBe(404);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).get(`/api/activities/4`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get(`/api/activities/4`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("activity with id 4 is finished");
			});
		});
	});
});

afterAll(async () => {
	await resetDB(false);
	// close the db connectionclea
	await db.sequelize.close();
});
