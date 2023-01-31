import { User } from "../../modules/users/entities/User";
import { hash } from 'bcryptjs';
import { Statement } from "../../modules/statements/entities/Statement";

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

  static giveMeAValidStatement(user_id: string): Statement{
    const statement = new Statement();

    Object.assign(statement, {
      user_id,
      type: "valid",
      amount: 100,
      description: "A valid statement"
    });

    return statement;
  };

}

export { TestUtils }
