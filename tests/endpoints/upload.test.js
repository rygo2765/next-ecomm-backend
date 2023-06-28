import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest";
import app from "../../app.js";

async function cleanupDatabase() {
    const prisma = new PrismaClient();
  
    // Specify the order of deletion based on foreign key relationships
    const deletionOrder = [
      "Images",
      "User",
      // Add other tables as needed
    ];
  
    for (const modelName of deletionOrder) {
      if (modelName === "User") {
        // Delete User records only if the Images records are already deleted
        const imagesCount = await prisma.images.count();
        if (imagesCount === 0) {
          await prisma[modelName.toLowerCase()].deleteMany();
        }
      } else {
        // Delete other records without any condition
        await prisma[modelName.toLowerCase()].deleteMany();
      }
    }
  }
  
  
describe("POST /upload", () => {
    
  beforeAll(async () => {
    await cleanupDatabase();
    // Make a user in the database
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("with valid credentials should return accessToken", async () => {
    // Sign user up
    const user = {
      name: "John",
      email: "john3@example.com",
      password: "insecure",
    };
    await request(app).post("/users").send(user);

    // Sign user in and get accessToken
    const loginResponse = await request(app)
      .post("/auth")
      .send(user)
      .set("Accept", "application/json");

    const token = loginResponse.body.accessToken;
    console.log(token)

    // Test upload
    const imageData = {
      title: "test",
      description: "this is a test image",
      price: 99,
      url: "https://example.com/images/myimage.jpg",
    };

    const imageResponse = await request(app)
      .post("/upload")
      .send(imageData)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(imageResponse.statusCode).toBe(200);
    expect(imageResponse.body.title).toBe(imageData.title);
    expect(imageResponse.body.description).toBe(imageData.description);
    expect(imageResponse.body.price).toBe(imageData.price*100);
    expect(imageResponse.body.url).toBe(imageData.url);
    // Add additional assertions as needed
  });
});