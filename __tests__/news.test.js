require("dotenv").config({ path: __dirname + "/../tests.env" });
const supertest = require("supertest");
const app = require("../app");
const db = require("../models/db");
const News = db.news;
const NewsImage = db.new_image;
const Users = db.users;
const cloudinary = require("../config/cloudinary.config");
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


describe("GET /api/news", () => {
    test("should return all news", async () => {
        const response = await supertest(app).get('/api/news');
        
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const newsArticles = response.body.data.news;
        expect(Array.isArray(newsArticles)).toBe(true);
        expect(newsArticles.length).toBeGreaterThan(0);
    
        newsArticles.forEach(article => {
            expect(article).toHaveProperty('id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('content');
          });
    })
})

describe("GET /api/news/:id", () => {
    test("should return one new", async () => {
        const newsId = 1; 

        const response = await supertest(app).get(`/api/news/${newsId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('isUserAdmin');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('content');

        expect(response.body.data.creator).toHaveProperty('id');
        expect(response.body.data.creator).toHaveProperty('name');

        expect(Array.isArray(response.body.data.images)).toBe(true);
        expect(response.body.data.images.length).toBeGreaterThan(0);
    })

    test('should return an error for non-existent news', async () => {
        const newsId = 999; 
    
        const response = await supertest(app).get(`/api/news/${newsId}`);
    
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('New does not exist');
    });
})

describe("POST /api/news", () => {
  test('should add a new article', async () => {
    const title = 'Test News';
    const content = 'Lorem ipsum dolor sit amet';
    const imgs = ['https://api-assets.ua.pt/v1/image/resizer?imageUrl=https://www.ua.pt/contents%2Fimgs%2Fliving%2Fviver_aveiro_6.jpg&height=1920', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEn9zgyZPPyYDgcnooM5T5EIzC5GFBIQJe_Q&usqp=CAU'];

    const existingNew = await News.findOne({ where: { title: title } });

    expect(existingNew).toBeNull();

    const response = await supertest(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: title,
        content: content,
        imgs: imgs
      });
    
      console.log(response);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('New was successfully added');

    const addedNew = await News.findOne({ where: { title: title } });
    expect(addedNew).toBeDefined();
    expect(addedNew.title).toBe(title);
    expect(addedNew.content).toBe(content);
    expect(addedNew.creator_id).toBe(1);
  });

  test('should return an error if the new already exists', async () => {
    const title = 'Descoberta de nova civilização antiga no mundo desafia a compreensão histórica';
    const content = 'Lorem ipsum dolor sit amet';
    const imgs = ['https://api-assets.ua.pt/v1/image/resizer?imageUrl=https://www.ua.pt/contents%2Fimgs%2Fliving%2Fviver_aveiro_6.jpg&height=1920', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEn9zgyZPPyYDgcnooM5T5EIzC5GFBIQJe_Q&usqp=CAU'];

    const existingNew = await News.findOne({ where: { title: title } });

    expect(existingNew).not.toBeNull();

    const response = await supertest(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: title,
        content: content,
        imgs: imgs
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('The new already exists');
  });
})


describe("DELETE /api/news/:id", () => {
  test("should delete a new", async () => {
    const newToDelete = await News.create({
      title: "Test New",
      content: "Test content",
      date_created: new Date().toISOString().split("T")[0],
      creator_id: 1,
    });

    const response = await supertest(app).delete(`/api/news/${newToDelete.id}`).set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("The new was deleted");

    const deletedNew = await News.findByPk(newToDelete.id);
    expect(deletedNew).toBeNull();

    const deletedImages = await NewsImage.findAll({ where: { new_id: newToDelete.id } });
    expect(deletedImages.length).toBe(0);
  });

  test("should return an error for non-existent new", async () => {
    const nonExistentNewId = 999;

    const response = await supertest(app).delete(`/api/news/${nonExistentNewId}`).set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("New was not found");
  });

})