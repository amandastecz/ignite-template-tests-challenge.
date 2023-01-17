import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Create User", ()=>{
  beforeAll(() =>{
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be able to create a new user", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Amanda",
      email: "amanda@unit.test.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  })
})
