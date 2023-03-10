import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Create Statement Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "statement@integration.com",
      password: "123456"
    });
  });

  it("should be able to create a statement type deposit", async() =>{

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "statement@integration.com",
      password: "123456"
    });

    const resp = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit"
      })
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("user_id");
      expect(resp.body.type).toBe("deposit");
  });

  it("should be able to create a statement type withdraw", async() =>{

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "statement@integration.com",
      password: "123456"
    });

    const resp = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw"
      })
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("user_id");
      expect(resp.body.type).toBe("withdraw");
  });

  it("should not be able to create a statement type withdraw from a account without credit", async() =>{

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "statement@integration.com",
      password: "123456"
    });

    const resp = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 1000,
        description: "Withdraw"
      })
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(400);
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
