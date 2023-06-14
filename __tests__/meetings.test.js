require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
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

// POST /api/meetings
describe("POST /api/meetings", () => {
	describe("when creating a meeting", () => {
		describe("when there is a verified user logged", () => {
			describe("when creating a meeting with valid data", () => {
				const meetingData = {
					date: "2023-12-20 09:30:00",
					description: "reunião com o coordenador de curso de TSIW prof.Mário Pinto",
					room: "B108",
				};

				test("should respond with a 201 status code", async () => {
					const response = await supertest(app)
						.post("/api/meetings")
						.set("Authorization", `Bearer ${userToken}`)
						.send(meetingData);
					const lastMeeting = await db.meetings.findOne({
						order: [["id", "DESC"]],
					});

					expect(response.statusCode).toBe(201);

					// delete the created meeting
					await db.meetings.destroy({
						where: {
							id: lastMeeting.id,
						},
					});
				});

				test("should respond with a JSON", async () => {
					const response = await supertest(app)
						.post("/api/meetings")
						.set("Authorization", `Bearer ${userToken}`)
						.send(meetingData);
					const lastMeeting = await db.meetings.findOne({
						order: [["id", "DESC"]],
					});

					expect(response.type).toBe("application/json");

					// delete the created meeting
					await db.meetings.destroy({
						where: {
							id: lastMeeting.id,
						},
					});
				});

				test("should respond with a message", async () => {
					const response = await supertest(app)
						.post("/api/meetings")
						.set("Authorization", `Bearer ${userToken}`)
						.send(meetingData);
					const lastMeeting = await db.meetings.findOne({
						order: [["id", "DESC"]],
					});
					expect(response.body.success).toBe(true);
					expect(response.body.message).toBe(`meeting created ${lastMeeting.id}`);
				});
			});

			describe("when creating a meeting with invalid data", () => {
				describe("when body is empty", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("body is empty");
					});
				});

				describe("when is missing required keys on the body", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({ date: "2023-12-20 09:30:00" });
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({ date: "2023-12-20 09:30:00" });
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({ date: "2023-12-20 09:30:00" });
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining(["description cannot be null", "room cannot be null"])
						);
					});
				});

				describe("when there are invalid keys instead the correct ones", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								datess: "2023-12-20 09:30:00",
								descriptionssad: "test",
								roomdsa: "test",
							});
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								datess: "2023-12-20 09:30:00",
								descriptionssad: "test",
								roomdsa: "test",
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								datess: "2023-12-20 09:30:00",
								descriptionssad: "test",
								roomdsa: "test",
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"datess is a invalid field",
								"descriptionssad is a invalid field",
								"roomdsa is a invalid field",
							])
						);
					});
				});

				describe("when the keys are empty", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "",
								description: "",
								room: "",
							});
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "",
								description: "",
								room: "",
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "",
								description: "",
								room: "",
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"date cannot be empty",
								"description cannot be empty",
								"room cannot be empty",
							])
						);
					});
				});

				describe("when the date is invalid", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "20230aa-06-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "20230aa-06-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "20230aa-06-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("date is invalid");
					});
				});

				describe("when the keys are not strings", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: 123,
								description: 123,
								room: 123,
							});
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: 123,
								description: 123,
								room: 123,
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: 123,
								description: 123,
								room: 123,
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"date must be a string",
								"description must be a string",
								"room must be a string",
							])
						);
					});
				});

				describe("when the date is in the past", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2020-03-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2020-03-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2020-03-20 09:30:00",
								description: "test",
								room: "test",
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("date cannot be in the past");
					});
				});

				describe("when creating a meeting schedule for the same date and room", () => {
					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2023-12-03 18:25:00",
								description: "test",
								room: "B302",
							});
						expect(response.statusCode).toBe(409);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2023-12-03 18:25:00",
								description: "test",
								room: "B302",
							});
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.post("/api/meetings")
							.set("Authorization", `Bearer ${userToken}`)
							.send({
								date: "2023-12-03 18:25:00",
								description: "test",
								room: "B302",
							});
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe(
							// remover o teste caso a hora altere na base de dados automaticamente
							"There is already a meeting schedule for this room, day and hour."
						);
					});
				});
			});
		});
		describe("when there is no logged in user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).post("/api/meetings");
				expect(response.statusCode).toBe(401);
			});
			test("should respond with a JSON", async () => {
				const response = await supertest(app).post("/api/meetings");
				expect(response.type).toBe("application/json");
			});
			test("should respond with a message", async () => {
				const response = await supertest(app).post("/api/meetings");
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when there is not verified user logged", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.post("/api/meetings")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.post("/api/meetings")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.post("/api/meetings")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});
	});
});

// PATCH /api/meetings/:id
describe("PATCH /api/meetings/:id", () => {
	// add ata to meeting
	describe("when adding an ata to a meeting", () => {
		describe("when there is not logged in user", () => {
			test("should respond with a 401 status code", async () => {
				const response = await supertest(app).patch("/api/meetings/3?fields=ata");
				expect(response.statusCode).toBe(401);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app).patch("/api/meetings/3?fields=ata");
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app).patch("/api/meetings/3?fields=ata");
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized!");
			});
		});

		describe("when the user is not verified", () => {
			test("should respond with a 403 status code", async () => {
				const response = await supertest(app)
					.patch("/api/meetings/3?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.statusCode).toBe(403);
			});

			test("should respond with a JSON", async () => {
				const response = await supertest(app)
					.patch("/api/meetings/3?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.type).toBe("application/json");
			});

			test("should respond with a message", async () => {
				const response = await supertest(app)
					.patch("/api/meetings/3?fields=ata")
					.set("Authorization", `Bearer ${unsignedToken}`);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Require Verified Role!");
			});
		});

		describe("when the user is verified", () => {
			describe("when adding an ata with invalid requested data", () => {
				describe("when the body is empty", () => {
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("body is empty");
					});
				});

				describe("when keys are invalid instead of the required ones", () => {
					const ata = {
						atadsa:
							"Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						imagesdsa: [base64Data.ataImg1],
					};
					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining([
								"atadsa is a invalid field",
								"imagesdsa is a invalid field",
							])
						);
					});
				});

				describe("when the keys are empty", () => {
					const ata = {
						ata: "",
						images: "",
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toEqual(
							expect.arrayContaining(["ata cannot be empty", "images cannot be empty"])
						);
					});
				});

				describe("when the keys are integers instead of strings", () => {
					const ata = {
						ata: 1231,
						images: [base64Data.ataImg1],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("ata must be a string");
					});
				});

				describe("when images is not an array", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: "base64Data.ataImg1",
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images must be an array or list");
					});
				});

				describe("when images are empty", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images are required");
					});
				});

				describe("when images are not an array of strings", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1, 123],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images must be an array of strings");
					});
				});

				describe("when images haves empty strings", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1, ""],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images cannot have empty strings");
					});
				});

				describe("when images does not have valid base64 strings", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1, "invalidBase64String"],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("images must be a valid base64 string");
					});
				});

				describe("when haves more then four images", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [
							base64Data.ataImg1,
							base64Data.ataImg1,
							base64Data.ataImg2,
							base64Data.ataImg3,
							base64Data.ataImg2,
						],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("you can only add 4 images");
					});
				});

				describe("when body missing keys", () => {
					const ata = {
						images: [base64Data.ataImg1],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/3?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("ata cannot be null");
					});
				});

				describe("when there is an invalid id requested", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1],
					};

					test("should respond with a 400 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1assd?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);

						expect(response.statusCode).toBe(400);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1assd?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1assd?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("Invalid id.");
					});
				});

				describe("when meeting does not exist", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1],
					};

					test("should respond with a 404 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/100?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(404);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/100?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/100?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("Meeting not found.");
					});
				});

				describe("when adding ata to a meeting that already has one", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1],
					};

					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(409);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/1?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("ATA already added to this meeting.");
					});
				});

				describe("when adding an ata to future meeting", () => {
					const ata = {
						ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
						images: [base64Data.ataImg1],
					};

					test("should respond with a 409 status code", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/5?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.statusCode).toBe(409);
					});

					test("should respond with a JSON", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/5?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.type).toBe("application/json");
					});

					test("should respond with a message", async () => {
						const response = await supertest(app)
							.patch("/api/meetings/5?fields=ata")
							.set("Authorization", `Bearer ${userToken}`)
							.send(ata);
						expect(response.body.success).toBe(false);
						expect(response.body.error).toBe("You can only add ATA to past meetings.");
					});
				});
			});

			describe("when adding an ata to meeting with a valid request", () => {
				const ata = {
					ata: "Esta reunião foi um sucesso, todos colaboraram para salvaguardar o meio ambiente :)",
					images: [base64Data.ataImg1],
				};

                test("should respond with a 200 status code", async () => {
                    const response = await supertest(app)
                        .patch("/api/meetings/2?fields=ata")
                        .set("Authorization", `Bearer ${userToken}`)
                        .send(ata);                    
                        expect(response.statusCode).toBe(200);
                    expect(response.body.success).toBe(true);
                    expect(response.type).toBe("application/json");
                    expect(response.body.message).toBe("ATA added to meeting 2");
                    
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
