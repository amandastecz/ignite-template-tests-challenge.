import { TestUtils } from "../../../../shared/tests/TestUtils";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Create User", ()=>{
  beforeAll(() =>{
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be able to create a new user", async ()=>{
    const user = TestUtils.giveMeAValidUser();
    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user if the email already exists", async ()=>{
    expect(async ()=>{
      const user = TestUtils.giveMeAValidUser();
      await userRepository.create(user);
      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(CreateUserError);

  });

  afterEach(()=>{
    userRepository.reset();
  });
})
