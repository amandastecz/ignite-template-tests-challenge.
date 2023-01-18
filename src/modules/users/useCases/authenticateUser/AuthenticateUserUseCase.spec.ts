import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

import { hash } from 'bcryptjs';

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Authenticate User", ()=>{
  beforeAll(()=>{
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("should be able to authenticate a user", async ()=>{
    const newUser = {
      name: "Amanda",
      email: "auth@test.com",
      password: await hash("auth",8)
    };

    await userRepository.create(newUser);

    const token = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: "auth",
    });

    expect(token).toHaveProperty('token');
  })
})
