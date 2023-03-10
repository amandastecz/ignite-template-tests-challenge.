import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { v4 } from "uuid";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection
describe("Authenticate User Controller", () => {
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

  it("should be able to authenticate a user", async ()=>{
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com.br",
      password: "123456"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a user if password is wrong", async ()=>{
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com.br",
      password: "wrong"
    });

    expect(response.statusCode).toBe(401);
  });

  it("should not be able to authenticate a user if email is wrong", async ()=>{
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@wrong.com.br",
      password: "123456"
    });

    expect(response.statusCode).toBe(401);
  });
})
