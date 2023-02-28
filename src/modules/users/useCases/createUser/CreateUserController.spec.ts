import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";
import request from "supertest";

import { TestUtils } from "../../../../shared/tests/TestUtils";

let connection: Connection
describe("Create User Controller", () => {
  beforeAll(async () =>{
    connection = await createConnection();
    connection.runMigrations();
  });

  afterAll(async () => {
    //connection.dropDatabase();
    connection.close();
  })
  it("should be able to create a new user", async () =>{
    const user = TestUtils.giveMeAValidUser();
    const response = await request(app).post("/users").send(user);

    expect(response.statusCode).toBe(201);
  })
})
