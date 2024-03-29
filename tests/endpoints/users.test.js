import { PrismaClient, Prisma } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}


describe("POST /users", () => {
  const user = {
    name: 'John',
    email: 'john9@example.com',
    password: 'insecure',
  }

  beforeAll(async () => {
    await cleanupDatabase()

  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  it("with valid data should return 200", async () => {
    const newUser ={
    name: 'John',
    email: 'john1@example.com',
    password:'insecure'
    }
    const response = await request(app)
      .post("/users")
      .send(newUser)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeTruthy;
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBe(undefined);
  });

  it("with same email should fail", async () => {
    const duplicateUser = {
      name: 'John',
      email: 'john2@example.com',
      password: 'insecure'
    }

    await request(app).post("/users").send(duplicateUser)

    const response = await request(app)
      .post("/users")
      .send(duplicateUser)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('already taken');
  });

  it("with invalid password should fail", async () => {
    user.email = "unique@example.com"
    user.password = "short"
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.password).toBe('should be at least 8 characters');
  });

  it("with invalid email format should fail", async () => {
    user.email = "laksmdflkmasdflkmw"
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept','application/json')
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('is invalid')
  })

  it("with no name input should fail", async () => {
    user.name = ""
    const response = await request(app)
      .post("/users")
      .send(user)
      .set('Accept','application/json')
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.name).toBe('cannot be blank')
  })
})