import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest"
import app from "../../app";

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}


describe("POST /auth", () => {
  const dummy = {
    email: 'john9@example.com',
    password: 'insecure',
  }

  beforeAll(async () => {
    await cleanupDatabase()
    //make a user in database
  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  it("with valid credentials should return accessToken", async () => {
    const user = {
      name: 'John',
      email: 'john9@example.com',
      password: 'insecure',
    }
    await request(app).post("/users").send(user)
    const response = await request(app)
      .post("/auth")
      .send(user)
      .set('Accept','application/json')
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeTruthy;
  })

  it("with incorrect email should fail and not return accessToken", async () => {
    dummy.email = "wrong@example.com"
    const response = await request(app)
      .post("/auth")
      .send(dummy)
      .set('Accept','application/json')
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.login).toBe('Email address or password not valid')
    expect(response.body.accessToken).toBeNull;
  })

  it("with incorrect password should fail and not return accessToken", async () => {
    dummy.password = "wrongpassword"
    const response = await request(app)
      .post("/auth")
      .send(dummy)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.login).toBe('Email address or password not valid')
  })

})