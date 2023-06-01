require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const colors = require("colors");
const db = require("../models/db");
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
const base64Data = require("../data/base64");
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

// POST /api/activities
describe("POST /api/activities", () => {
	describe("invalid requests", () => {
		describe("when there any parameter provided", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("provide parameters");
			});
		});

		describe("when the fields key is empty", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("fields is empty");
			});
		});

		describe("when the fields key is invalid", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=adas`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=adas`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=adas`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("adas is an invalid value for the fields parameter");
			});
		});

		describe("when there is an invalid parameter instead of fields", () => {
			test("should respond with a 400 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fieldsssas=activity`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(400);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fieldsssas=activity`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fieldsssas=activity`)
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.error).toBe("fieldsssas is an invalid parameter");
			});
		});
	});

	// creating an activity
	describe("when creating an activity", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).post(`/api/activities?fields=activity`);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).post(`/api/activities?fields=activity`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).post(`/api/activities?fields=activity`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=activity`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=activity`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=activity`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a logged user", () => {
			describe("when the create activity request is invalid", () => {
				describe("when is missing data on the request body", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send({
								theme_id: 3,
							})
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send({
								theme_id: 3,
							})
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send({
								theme_id: 3,
							})
							.set("Authorization", `Bearer ${userToken}`);
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

				describe("when there is empty data on the body request", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "",
						complexity: "",
						initial_date: "",
						final_date: "",
						objective: "",
						diagnostic: "",
						meta: "",
						resources: "",
						participants: "",
						evaluation_indicator: "",
						evaluation_method: "",
						images: "",
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"title cannot be empty",
								"complexity cannot be empty",
								"initial_date cannot be empty",
								"final_date cannot be empty",
								"objective cannot be empty",
								"diagnostic cannot be empty",
								"meta cannot be empty",
								"resources cannot be empty",
								"participants cannot be empty",
								"evaluation_indicator cannot be empty",
								"evaluation_method cannot be empty",
								"images cannot be empty",
							])
						);
					});
				});

				describe("when the keys body are invalid", () => {
					const invalidBodyActivity = {
						theme_ids: 3,
						titles: "colocação de caixotes de água",
						complexitys: 3,
						initialDdate: "2023-06-12",
						finalfdate: "2023-07-12",
						objectivesaa:
							"Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnosticdsa: "Excesso de água dispendida em tarefas domésticas",
						metaas:
							"Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resourcedsas:
							"Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participantdsas: "Estudantes da ESHT",
						evaluation_inddsaicator: "Divulgação no facebook e no instagram",
						evaluation_methodsd: "Registo Fotográfico",
						imagesdas: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(invalidBodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(invalidBodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(invalidBodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"theme_ids is a invalid field",
								"titles is a invalid field",
								"complexitys is a invalid field",
								"initialDdate is a invalid field",
								"finalfdate is a invalid field",
								"objectivesaa is a invalid field",
								"diagnosticdsa is a invalid field",
								"metaas is a invalid field",
								"resourcedsas is a invalid field",
								"participantdsas is a invalid field",
								"evaluation_inddsaicator is a invalid field",
								"evaluation_methodsd is a invalid field",
								"imagesdas is a invalid field",
							])
						);
					});
				});

				describe("when theme id is not a number", () => {
					const bodyActivity = {
						theme_id: "3",
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("theme_id must be a number");
					});
				});

				describe("when complexity is not a number", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: "3",
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("complexity must be a number");
					});
				});

				describe("when complexity is not between 1 and 5", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 6,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("complexity must be between 1 and 5");
					});
				});

				describe("when adding more then four images", () => {
					const bodyActivity = {
						theme_id: 1,
						title: "Colocação de Caixotes de água 13",
						complexity: 4,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "aa",
						diagnostic: "aa",
						meta: "aa",
						resources: "aa",
						participants: "aa",
						evaluation_indicator: "aa",
						evaluation_method: "aa",
						images: [
							`${base64Data.activityImg1}`,
							`${base64Data.activityImg2}`,
							`${base64Data.activityImg3}`,
							`${base64Data.activityImg4}`,
							`${base64Data.activityImg5}`,
						],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("you can only add 4 images");
					});
				});

				describe("when initial date is not a valid date", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-40",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("initial_date must be a valid date");
					});
				});

				describe("when intial date haves a invalid year", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2001-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("invalid year for initial_date");
					});
				});

				describe("when there is keys with integer values but should be string", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: 123,
						diagnostic: 123,
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"objective must be a string",
								"diagnostic must be a string",
							])
						);
					});
				});

				describe("when images is not an array", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: "asd",
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images must be an array or list");
					});
				});

				describe("when images is an empty array", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images are required");
					});
				});

				describe("when images is an array of empty strings", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [""],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images cannot have empty strings");
					});
				});

				describe("when images does not have base64 strings", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "colocação de caixotes de água",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: ["dasdas"],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images must be a valid base64 string");
					});
				});

				describe("when the initial date is before the current date", () => {
					const bodyActivity = {
						theme_id: 5,
						title: "colocação de caixotes de água 2",
						complexity: 3,
						initial_date: "2023-05-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: ["dasdas"],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("initial_date must be after the current date");
					});
				});

				describe("when requesting not found theme", () => {
					const bodyActivity = {
						theme_id: 10,
						title: "colocação de caixotes de água 2",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 404 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(404);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("theme not found");
					});
				});

				describe("when requesting a theme that is not active", () => {
					const bodyActivity = {
						theme_id: 5,
						title: "colocação de caixotes de água 2",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(409);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("Theme is not active");
					});
				});

				describe("when requesting an activity with a title that already exists", () => {
					const bodyActivity = {
						theme_id: 3,
						title: "Colocação de Caixotes do Lixo",
						complexity: 3,
						initial_date: "2023-06-12",
						final_date: "2023-07-12",
						objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
						diagnostic: "Excesso de água dispendida em tarefas domésticas",
						meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
						resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
						participants: "Estudantes da ESHT",
						evaluation_indicator: "Divulgação no facebook e no instagram",
						evaluation_method: "Registo Fotográfico",
						images: [`${base64Data.activityImg1}`],
					};

					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(409);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should response with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=activity`)
							.send(bodyActivity)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("Activity already exists");
					});
				});
			});

			describe("when creating an activity with valid data", () => {
				const bodyActivity = {
					theme_id: 3,
					title: "colocação de caixotes de água",
					complexity: 3,
					initial_date: "2023-06-12",
					final_date: "2023-07-12",
					objective: "Sensibilizar a comunidade escolar para a necessidade de poupar água",
					diagnostic: "Excesso de água dispendida em tarefas domésticas",
					meta: "Divulgação, nas redes sociais, de informação de sensibilização para a poupança de água",
					resources: "Material de divulgação produzido ao abrigo do Concurso Eco-P.PORTO",
					participants: "Estudantes da ESHT",
					evaluation_indicator: "Divulgação no facebook e no instagram",
					evaluation_method: "Registo Fotográfico",
					images: [`${base64Data.activityImg1}`],
				};

				test("should respond with a 201 status code", async () => {
					const response = await supertest(app)
						.post(`/api/activities?fields=activity`)
						.send(bodyActivity)
						.set("Authorization", `Bearer ${userToken}`);
					
						const lastActivity = await db.activities.findOne({
							order: [["id", "DESC"]],
						});
					
						expect(response.statusCode).toBe(201);
					expect(response.body.success).toBe(true);
					expect(response.body.message).toBe(`activity created ${lastActivity.id}`);

				});
			});
		});
	});

	// creating a theme
	describe("when creating a theme", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).post(`/api/activities?fields=theme`);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).post(`/api/activities?fields=theme`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).post(`/api/activities?fields=theme`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified logged in user", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post(`/api/activities?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a logged verified user", () => {
			describe("when creating a new theme", () => {
				describe("when the theme is valid", () => {
					test("should respond with a 201 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "biodiversidade" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(201);

						// deleting the theme
						await db.theme.destroy({ where: { name: "biodiversidade" } });
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "biodiversidade" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");

						// deleting the theme
						await db.theme.destroy({ where: { name: "biodiversidade" } });
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "biodiversidade" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(true);
						expect(response.body.data).toBe("theme created successfully");

						// deleting the theme
						await db.theme.destroy({ where: { name: "biodiversidade" } });
					});
				});

				describe("when the theme already exists", () => {
					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "Mar" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(409);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "Mar" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.send({ name: "Mar" })
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("Theme already exists");
					});
				});

				describe("when the body is empty", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with JSON", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post(`/api/activities?fields=theme`)
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("body is empty");
					});
				});

				describe("when the body is invalid", () => {
					describe("when the key name is invalid", () => {
						test("should respond with a 400 status code", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ namedd: "biodiversidade" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.statusCode).toBe(400);
						});

						test("should respond with JSON", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ namedd: "biodiversidade" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.type).toBe("application/json");
						});

						test("should respond with a message", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ namedd: "biodiversidade" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.body.success).toBe(false);
							expect(response.body.error).toBe("namedd is not a valid field");
						});
					});

					describe("when the key name is empty", () => {
						test("should respond with a 400 status code", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: "" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.statusCode).toBe(400);
						});

						test("should respond with JSON", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: "" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.type).toBe("application/json");
						});

						test("should respond with a message", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: "" })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.body.success).toBe(false);
							expect(response.body.error).toBe("name cannot be empty");
						});
					});

					describe("when the key name is not a string", () => {
						test("should respond with a 400 status code", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: 123 })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.statusCode).toBe(400);
						});

						test("should respond with JSON", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: 123 })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.type).toBe("application/json");
						});

						test("should respond with a message", async () => {
							const response = await supertest(app)
								.post(`/api/activities?fields=theme`)
								.send({ name: 123 })
								.set("Authorization", `Bearer ${userToken}`);
							expect(response.body.success).toBe(false);
							expect(response.body.error).toBe("name must be a string");
						});
					});
				});
			});
		});
	});
});

// PATCH /api/activities/:id
describe("PATCH /api/activities/:id", () => {
	describe("when disabled a theme", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).patch(`/api/activities/4?fields=theme`);
				expect(response.statusCode).toBe(401);
			});
			test("should respond with JSON", async () => {
				const response = await supertest(app).patch(`/api/activities/4?fields=theme`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).patch(`/api/activities/4?fields=theme`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verfified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.patch(`/api/activities/4?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.patch(`/api/activities/4?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.patch(`/api/activities/4?fields=theme`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a verified user logged", () => {
			describe("when requesting an invalid id", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/1asd?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/1asd?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/1asd?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("invalid id");
				});
			});

			describe("when disable a valid theme", () => {
				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/4?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(200);

					await db.theme.update({ is_active: true }, { where: { id: 4 } });
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/4?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");

					await db.theme.update({ is_active: true }, { where: { id: 4 } });
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/4?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.message).toBe("the theme Resíduos is now disabled");
				});
			});

			describe("when disable an disable theme", () => {
				test("should respond with a 409 status code", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/5?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(409);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/5?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/5?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("Theme is already disabled");
				});
			});

			describe("when disable not found theme", () => {
				test("should respond with a 404 status code", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/100?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(404);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/100?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.patch(`/api/activities/100?fields=theme`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("Theme not found");
				});
			});
		});
	});
});

// DELETE /api/activities/:id
describe("DELETE /api/activities/:id", () => {
	describe("when deleting an activity", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).delete(`/api/activities/1`);
				expect(response.statusCode).toBe(401);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app).delete(`/api/activities/1`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).delete(`/api/activities/1`);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not a verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.delete(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with JSON", async () => {
				const response = await supertest(app)
					.delete(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.delete(`/api/activities/1`)
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a verified user logged", () => {
			describe("when requesting an invalid id", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/1asd`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/1asd`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/1asd`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("invalid id");
				});
			});

			describe("when deleting an activity not found", () => {
				test("should respond with a 404 status code", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/100`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(404);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/100`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/100`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("Activity not found");
				});
			});

			describe("when deleting an finished activity", () => {
				test("should respond with a 409 status code", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/5`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(409);
				});

				test("should respond with JSON", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/5`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/5`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("you can´t delete a finished activity");
				});
			});

			describe("when deleting an valid activity", () => {
				test("should respond with a 200 status code", async () => {
					const deletedActivity = await db.activities.findByPk(1);

					const response = await supertest(app)
						.delete(`/api/activities/1`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(200);

					// return the deleted activity
					await db.activities.create(deletedActivity.dataValues);
				});

				test("should respond with JSON", async () => {
					const deletedActivity = await db.activities.findByPk(1);

					const response = await supertest(app)
						.delete(`/api/activities/1`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");

					// return the deleted activity
					await db.activities.create(deletedActivity.dataValues);
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.delete(`/api/activities/1`)
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.message).toBe("the activity deleted successfully");
				});
			});
		});
	});
});

afterAll(async () => {
	await resetDB(false);
	// close the db connectionclea
	await db.sequelize.close();
});
