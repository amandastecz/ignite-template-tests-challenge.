import { User } from "../../modules/users/entities/User";
import { hash } from 'bcryptjs';

class TestUtils {
  static giveMeAValidUser(): User{
    const user = new User();

    Object.assign(user, {
      name: "Amanda",
      email: "email@valid.com",
      password: "123456"
    });

    return user;
  };

  static async giveMeAValidUserWithHash(): Promise<User>{
    const user = new User();

    Object.assign(user, {
      name: "Amanda",
      email: "email@valid.com",
      password:  await hash("auth",8)
    });

    return user;
  };


}

export { TestUtils }
