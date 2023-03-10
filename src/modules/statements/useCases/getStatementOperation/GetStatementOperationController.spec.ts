import { Connection,createConnection} from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;
describe("Get Statement Operation Controller", ()=> {

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post("/api/v1/users").send({
      name: "Amanda",
      email: "balancedetails@integration.com",
      password: "123456"
    });
  });

  it("should be able to list the details of a deposit from a valid user", async() =>{
    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "balancedetails@integration.com",
      password: "123456"
    });

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit"
      })
      .set("Authorization", `Bearer ${body.token}`);

      const resp = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .send()
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("user_id");
      expect(resp.body).toHaveProperty("amount");
      expect(resp.body.type).toBe("deposit");
  });

  it("should be able to list the details of a withdraw from a valid user", async() =>{
    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "balancedetails@integration.com",
      password: "123456"
    });

    const withdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 80,
        description: "withdraw"
      })
      .set("Authorization", `Bearer ${body.token}`);

      const resp = await request(app)
      .get(`/api/v1/statements/${withdraw.body.id}`)
      .send()
      .set("Authorization", `Bearer ${body.token}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("id");
      expect(resp.body).toHaveProperty("user_id");
      expect(resp.body).toHaveProperty("amount");
      expect(resp.body.type).toBe("withdraw");
  });

  it("should not be able to list the details of a statements with a invalid id and token", async() =>{

    const resp = await request(app)
    .get(`/api/v1/statements/12371`)
    .send()
    .set("Authorization", `Bearer invalidtoken`);

      expect(resp.statusCode).toBe(401);
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
})
