import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Get Balance Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "balance@integration.com",
      password: "123456"
    });
  });

  it("should be able to list all deposit and withdraw and also total balance from a valid user", async() =>{

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "balance@integration.com",
      password: "123456"
    });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit"
      })
      .set("Authorization", `Bearer ${body.token}`);

      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit"
      })
      .set("Authorization", `Bearer ${body.token}`);

      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit"
      })
      .set("Authorization", `Bearer ${body.token}`);

      await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 80,
        description: "Withdraw"
      })
      .set("Authorization", `Bearer ${body.token}`);

      const resp = await request(app)
      .get("/api/v1/statements/balance")
      .send({
        amount: 80,
        description: "Withdraw"
      })
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("statement");
      expect(resp.body.statement).toHaveLength(4);
      expect(resp.body).toHaveProperty("balance");
  });

  it("should not be able to list total balance with a invalid token", async() =>{

      const resp = await request(app)
      .get("/api/v1/statements/balance")
      .send({
        amount: 80,
        description: "Withdraw"
      })
      .set("Authorization", `Bearer invalidtoken`);

      expect(resp.statusCode).toBe(401);
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
