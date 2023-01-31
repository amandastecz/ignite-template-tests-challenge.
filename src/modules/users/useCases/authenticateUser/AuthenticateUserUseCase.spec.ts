import { TestUtils } from "../../../../shared/tests/TestUtils";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Authenticate User", ()=>{
  beforeAll(()=>{
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("should be able to authenticate a user", async ()=>{
    const newUser = await TestUtils.giveMeAValidUserWithHash();
    await userRepository.create(newUser);
    const token = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: "auth",
    });

    expect(token).toHaveProperty('token');
  });

  it("should not be able to authenticate when the password is wrong", async()=>{
    const newUser = await TestUtils.giveMeAValidUserWithHash();
    await userRepository.create(newUser);

    expect(async()=>{
      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "wrong",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate when the email is wrong", async()=>{
    const newUser = await TestUtils.giveMeAValidUserWithHash();
    await userRepository.create(newUser);

    expect(async()=>{
      await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: "auth",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  afterEach(()=>{
    userRepository.reset();
  });
})
