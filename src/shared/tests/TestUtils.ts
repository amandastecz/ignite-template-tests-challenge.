import { User } from "../../modules/users/entities/User";
import { hash } from 'bcryptjs';
import { Statement } from "../../modules/statements/entities/Statement";
import { faker } from "@faker-js/faker";

class TestUtils {
  static giveMeAValidUser(): User{
    const user = new User();

    Object.assign(user, {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: "123456"
    });

    return user;
  };

  static async giveMeAValidUserWithHash(): Promise<User>{
    const user = new User();

    Object.assign(user, {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password:  await hash("auth",8)
    });

    return user;
  };

  static giveMeAValidStatement(user_id: string, type="deposit", amount=100): Statement{
    const statement = new Statement();

    Object.assign(statement, {
      user_id,
      type,
      amount,
      description: "A valid statement"
    });

    return statement;
  };
}

export { TestUtils }
