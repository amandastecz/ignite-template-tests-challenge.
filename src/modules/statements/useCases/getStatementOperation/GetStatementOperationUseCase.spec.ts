import { TestUtils } from "../../../../shared/tests/TestUtils";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation",()=>{
  beforeAll(()=>{
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  describe("When deposit", ()=>{
    it("should be able to return the found deposit operation information", async()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      const deposit = TestUtils.giveMeAValidStatement(user.id as string);
      await statementsRepository.create(deposit);
      const response = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: deposit.id as string
      });

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("type");
      expect(response.type).toBe("deposit");
    });
  });

  describe("When withdraw", ()=>{
    it("should be able to return the found withdraw operation information", async()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      const withdraw = TestUtils.giveMeAValidStatement(user.id as string, "withdraw");
      await statementsRepository.create(withdraw);
      const response = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: withdraw.id as string
      });

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("type");
      expect(response.type).toBe("withdraw");
    });
  });

  it("should not be able to return a statement operation information when the user not exists", async()=>{
    expect(async ()=>{
      const statement = TestUtils.giveMeAValidStatement('');
      await statementsRepository.create(statement);
      await getStatementOperationUseCase.execute({
        user_id: '',
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to return a statement operation information when the statement not exists", async()=>{
    expect(async ()=>{
      const user = TestUtils.giveMeAValidUser();
      await usersRepository.create(user);
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: '',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  afterEach(async ()=>{
    await usersRepository.reset();
    await statementsRepository.reset();
  });
})
