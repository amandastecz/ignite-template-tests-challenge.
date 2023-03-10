import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { v4 } from "uuid";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection
describe("Show User Profile Controller", () => {
  beforeAll(async () =>{
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("123456", 8);

    await connection.query(`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES ('${v4()}', 'admin', 'admin@test.com.br', '${password}', NOW())`);

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show the profile of a existent user", async ()=>{

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com.br",
      password: "123456"
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });

  it("should not be able to show the profile if the user is not authenticated", async ()=>{

    const response = await request(app)
      .get("/api/v1/profile");

    expect(response.statusCode).toBe(401);
  });

  it("should not be able to show the profile if the token is invalid", async ()=>{

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer invalidtoken`);

    expect(response.statusCode).toBe(401);
  });

})
