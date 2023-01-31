import { TestUtils } from "../../../../shared/tests/TestUtils";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", ()=>{
  beforeAll(()=>{
    userRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  });

  it("should be able to list the user information", async ()=>{
    const user = TestUtils.giveMeAValidUser();
    await userRepository.create(user);
    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toBeInstanceOf(User);
  });

  it("should not be able to list the user information when the user doesn't exists", async ()=>{
    expect(async ()=>{
      await showUserProfileUseCase.execute('1');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  afterEach(()=>{
    userRepository.reset();
  });

})
