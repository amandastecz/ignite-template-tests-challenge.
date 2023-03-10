import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Authenticate User Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to authenticate a existent user", async() =>{
    await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "authentication@integration.com",
      password: "123456"
    });

    const resp = await request(app).post("/api/v1/sessions").send({
      email: "authentication@integration.com",
      password: "123456"
    });

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toHaveProperty("token");
    expect(resp.body).toHaveProperty("user");
  });

  it("should not be able to authenticate a existent user with a wrong password", async() =>{
    const resp = await request(app).post("/api/v1/sessions").send({
      email: "authentication@integration.com",
      password: "wrong"
    });

    expect(resp.statusCode).toEqual(401);
  });

  it("should not be able to authenticate a non existent", async() =>{
    const resp = await request(app).post("/api/v1/sessions").send({
      email: "non@integration.com",
      password: "123456"
    });

    expect(resp.statusCode).toEqual(401);
  });


  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
