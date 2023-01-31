import { User } from "../../modules/users/entities/User";

class TestUtils {
  static giveMeAValidUser(): User{
    const user = new User();

    Object.assign(user, {
      name: "Amanda",
      email: "email@valid.com",
      password: "123456"
    });

    return user;
  }
}

export { TestUtils }
