import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Show User Profile Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to show a user profile from a existent user", async() =>{
    await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "showprofile@integration.com",
      password: "123456"
    });

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "showprofile@integration.com",
      password: "123456"
    });

    const resp = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("name");
      expect(resp.body).toHaveProperty("email");
  });

  it("should not be able to show the profile if the user is not authenticated", async ()=>{

    const resp = await request(app)
      .get("/api/v1/profile");

    expect(resp.statusCode).toBe(401);
  });

  it("should not be able to show the profile if the token is invalid", async ()=>{

    const resp = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer invalidtoken`);

    expect(resp.statusCode).toBe(401);
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
