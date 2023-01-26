import { AppError } from "../../../../shared/errors/AppError";
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
  });

  it("should not be able to create a new user if the email already exists", async ()=>{
    expect(async ()=>{

      await createUserUseCase.execute({
        name: "Amanda",
        email: "email@exists.test.com",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "Amanda",
        email: "email@exists.test.com",
        password: "123456"
      });

    }).rejects.toBeInstanceOf(AppError);

  });
})
