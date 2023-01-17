import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Authenticate User", ()=>{
  beforeAll(()=>{
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("should be able to authenticate a user", async ()=>{

    const user = await userRepository.create({
      name: "Amanda",
      email: "amanda@oauth.test.com",
      password: "123456",
    });

    const token = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(token).toHaveProperty("token");

  })
})
