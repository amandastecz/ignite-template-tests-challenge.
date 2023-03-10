import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

import { TestUtils } from "../../../../shared/tests/TestUtils";

let connection: Connection
describe("Create User Controller", () => {
  beforeAll(async () =>{
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () =>{
    const user = TestUtils.giveMeAValidUser();
    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.statusCode).toBe(201);
  });

  it("should not be able to create a user if already exists", async () =>{
    const user = TestUtils.giveMeAValidUser();
    await request(app).post("/api/v1/users").send(user);
    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.statusCode).toBe(400);
  });
})
