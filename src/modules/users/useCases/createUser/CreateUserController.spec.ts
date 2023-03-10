import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Create User Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to create a new user", async() =>{
    const resp = await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "backtothebeginning@integration.com",
      password: "123456"
    });

    expect(resp.statusCode).toEqual(201);
  });

  it("should not be able to create a duplicated email user", async() =>{
    const resp = await request(app).post("/api/v1/users").send({
      name: "Cristine",
      email: "backtothebeginning@integration.com",
      password: "123456"
    });

    expect(resp.statusCode).toEqual(400);
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
