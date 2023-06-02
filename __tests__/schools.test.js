require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const Schools = db.schools;
const resetDB = require("../data/resetDB");
const getToken = require("../utils/generateTokens");
let adminToken = "";
let userToken = "";
let unsignedToken = "";


beforeAll(async () => {
	await resetDB(false);

	// generate tokens for the tests
	adminToken = await getToken("admin", false);
	userToken = await getToken("user", false);
	unsignedToken = await getToken("unsigned", false);
}, 10000);

describe("GET /api/schools", () => {
    test("should fetch all schools", async () => {
        const expectedSchools = [
          { id: 1, name: "ESMAD" },
          { id: 2, name: "ESAG" },
          { id: 3, name: "ESTG" },
          { id: 4, name: "ESTM" },
          { id: 5, name: "ESTSP" },
          { id: 6, name: "ESTeSC" },
          { id: 7, name: "ISCEM" },
          { id: 8, name: "IST" },
          { id: 9, name: "UBI" },
          { id: 10, name: "UFSC" },
          { id: 11, name: "UTAD" },
          { id: 12, name: "UTL" },
        ];
    
        const response = await supertest(app).get("/api/schools");
    
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(expectedSchools);
      });
})

describe("GET /api/schools/:id", () => {
    test("should fetch a single school", async () => {
        const schoolId = 1;

        const response = await supertest(app).get(`/api/schools/${schoolId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.school.id).toBe(schoolId);
    })

    test("should return 404 if school does not exist", async () => {
        const schoolId = 100;

        const response = await supertest(app).get(`/api/schools/${schoolId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("School does not exist");
})
})

describe("POST /api/schools", () => {
    test("should create a new school", async () => {
        const newSchoolName = "New School";

        const response = await supertest(app)
        .post("/api/schools")
        .send({ name: newSchoolName })
        .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("School successfully added");
        expect(response.body.data.name).toBe(newSchoolName);
        
    })

    test("should return 409 if school already exists", async () => {
        const existingSchoolName = "ESMAD";

        const response = await supertest(app)
        .post("/api/schools")
        .send({ name: existingSchoolName })
        .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("The school already exists");
    })
})

describe("PUT /api/schools/:id", () => {
    test("should update a school", async () => {
        const existingSchoolId = 1;
        const updatedSchoolName  = "NEWSCHOOL";

        const response = await supertest(app)
        .put(`/api/schools/${existingSchoolId}`)
        .send({ name: updatedSchoolName })
        .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("The school name was updated");

        const updatedSchool = await Schools.findByPk(existingSchoolId);
        expect(updatedSchool.name).toBe(updatedSchoolName);
    })

    test("should return 404 if school is not found", async () => {
        const nonExistingSchoolId = 999;
        const updatedSchoolName = "NEWSCHOOL";
    
        const response = await supertest(app)
          .put(`/api/schools/${nonExistingSchoolId}`)
          .send({ name: updatedSchoolName })
          .set("Authorization", `Bearer ${adminToken}`);
    
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("School was not found");
      });
})


afterAll(async () => {
	await resetDB(false);
	// close the db connectionclea
	await db.sequelize.close();
});