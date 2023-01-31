import { TestUtils } from "../../../../shared/tests/TestUtils";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", ()=>{

  beforeAll(()=>{
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  })

  describe("When deposit", ()=>{
    it("should be able to make a deposit into an existent account", async ()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      const statement = TestUtils.giveMeAValidStatement(user.id as string);
      const response = await createStatementUseCase.execute(statement);

      expect(response).toHaveProperty("id");
    });

    it("should not to be able to make a deposit into an non existent account", async ()=>{
      expect(async ()=>{
        const statement = TestUtils.giveMeAValidStatement('' as string);
        await createStatementUseCase.execute(statement);
      }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });
  });

  describe("When withdraw", ()=>{
    it("should be able to withdraw to an account with sufficient balance", async ()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      const deposit = TestUtils.giveMeAValidStatement(user.id as string);
      await createStatementUseCase.execute(deposit);
      const withdraw = TestUtils.giveMeAValidStatement(user.id as string, "withdraw");
      const response = await createStatementUseCase.execute(withdraw);

      expect(response).toHaveProperty("id");
    });

    it("should not be able to withdraw from an account with insufficient balance", async ()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      const deposit = TestUtils.giveMeAValidStatement(user.id as string);
      await createStatementUseCase.execute(deposit);
      const withdraw = TestUtils.giveMeAValidStatement(user.id as string, "withdraw", 150);
      expect(async ()=>{
        await createStatementUseCase.execute(withdraw);
      }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

    });
  })

  afterEach(async ()=>{
    await usersRepository.reset();
    await statementsRepository.reset();
  });
})
