require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const colors = require("colors");
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

// GET meetings
describe("GET /api/meetings", () => {
	describe("when providing an invalid parameter instead of filter", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filterss=past")
				.set("Authorization", `Bearer ${userToken}`);

			expect(response.statusCode).toBe(400);
		});

		test("should respond with a JSON", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filterss=past")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filterss=past")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("filterss is an invalid  parameter");
		});
	});

	describe("when filter is empty", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a JSON", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("filter is empty");
		});
	});

	describe("when filter haves an invalid value", () => {
		test("should respond with a 400 status code", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=invalid")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.statusCode).toBe(400);
		});

		test("should respond with a JSON", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=invalid")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.type).toBe("application/json");
		});

		test("should respond with a message", async () => {
			const response = await supertest(app)
				.get("/api/meetings?filter=invalid")
				.set("Authorization", `Bearer ${userToken}`);
			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("invalid is an invalid value for the filter parameter");
		});
	});

	// getting past meetings
	describe("when getting past meetings", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get("/api/meetings?filter=past");
				expect(response.statusCode).toBe(401);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app).get("/api/meetings?filter=past");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/meetings?filter=past");
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a verified user logged", () => {
			const pastMeetings = [];
			beforeAll(async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${userToken}`);
				pastMeetings.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=past")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(pastMeetings);
			});
		});
	});

	// getting future meetings
	describe("when getting future meetings", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get("/api/meetings?filter=future");
				expect(response.statusCode).toBe(401);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app).get("/api/meetings?filter=future");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/meetings?filter=future");
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a verified user logged", () => {
			const futureMeetings = [];
			beforeAll(async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${userToken}`);
				futureMeetings.push(...response.body.data);
			});

			test("should respond with a 200 status code", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.statusCode).toBe(200);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get("/api/meetings?filter=future")
					.set("Authorization", `Bearer ${userToken}`);
				expect(response.body.success).toBe(true);
				expect(response.body.data).toEqual(futureMeetings);
			});
		});
	});

	// when getting one meeting ata
	describe("when getting one meeting data", () => {
		describe("when there is no logged user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).get("/api/meetings/1?fields=ata");
				expect(response.statusCode).toBe(401);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app).get("/api/meetings/1?fields=ata");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).get("/api/meetings/1?fields=ata");
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.get("/api/meetings/1?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.get("/api/meetings/1?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.get("/api/meetings/1?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when there is a verified user logged", () => {
			describe("when getting one meeting ata with a valid id", () => {
				let meetingAta = {};

				beforeAll(async () => {
					const response = await supertest(app)
						.get("/api/meetings/1?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					meetingAta = response.body.data;
				});

				test("should respond with a 200 status code", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(200);
				});

				test("should respond with a JSON", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(true);
					expect(response.body.data).toEqual(meetingAta);
				});

				describe("when getting an ata that does not have an ata yet", () => {
					test("should respond with a 404 status code", async () => {
						const response = await supertest(app)
							.get("/api/meetings/2?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(404);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.get("/api/meetings/2?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.get("/api/meetings/2?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("This meeting don´t have an ata yet.");
					});
				});
			});

			describe("when getting one meeting ata with a invalid id", () => {
				test("should respond with a 400 status code", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1sdaf?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.statusCode).toBe(400);
				});

				test("should respond with a JSON", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1sdaf?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.type).toBe("application/json");
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.get("/api/meetings/1sdaf?fields=ata")
						.set("Authorization", `Bearer ${userToken}`);
					expect(response.body.success).toBe(false);
					expect(response.body.error).toBe("Invalid id.");
				});
			});

            describe("when getting an ata from meeting that doesnt exist", () => {
                test("should respond with a 404 status code", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/100?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.statusCode).toBe(404);
                });

                test("should respond with a JSON", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/100?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.type).toBe("application/json");
                });

                test("should respond with a message", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/100?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.body.success).toBe(false);
                    expect(response.body.error).toBe("Meeting not found.");
                });
            });

            describe("when getting an ata from a future meeting", () => {
                test("should respond with a 404 status code", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/5?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.statusCode).toBe(404);
                });

                test("should respond with a JSON", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/5?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.type).toBe("application/json");
                });

                test("should respond with a message", async () => {
                    const response = await supertest(app)
                        .get("/api/meetings/5?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`);
                    expect(response.body.success).toBe(false);
                    expect(response.body.error).toBe("This his a future meeting.");
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
