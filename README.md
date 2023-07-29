# Unit tests and integration with Jest for a Node.js application

## Application routes

### POST `/api/v1/users`

- The route receives `name`, `email` and `password` inside the request body, saves the user created in the database and returns an empty response with status `201`.
- [X] should be able to create a new user
- [X] should not be able to create a new user if the email already exists

### POST `/api/v1/sessions`

- The route receives `email` and `password` in the request body and returns the authenticated user's data together with a JWT token.
- [X] should be able to authenticate a user
- [X] should not be able to authenticate when the password is wrong
- [X] should not be able to authenticate when the email is wrong

<aside>
💡 This application does not have a refresh token, that is, the token created lasts only 1 day and must be recreated after the mentioned period.

</aside>

### GET `/api/v1/profile`

- The route receives a JWT token through the request header and returns the authenticated user information.
- [X] should be able to list the user information
- [X] should not be able to list the user information when the user doesn't exist

### GET `/api/v1/statements/balance`

- The route receives a JWT token through the request header and returns a list of all deposit and withdrawal operations by the authenticated user and also the total balance in a `balance` property.
- [X] should be able to list all deposit and withdraw and also total balance from a valid user
- [X] should not be able to find the balance information from a nonexistent user

### POST `/api/v1/statements/deposit`

- The route receives a JWT token through the header and `amount` and `description` in the request body, registers the value deposit operation and returns the information of the deposit created with status `201`.
- [X] should be able to make a deposit into an existing account
- [X] should not be able to make a deposit into a non existent account

### POST `/api/v1/statements/withdraw`

- The route receives a JWT token through the header and `amount` and `description` in the request body, registers the withdrawal operation of the value (if the user has a valid balance) and returns the withdrawal information created with status `201`.
- [X] should be able to withdraw to an account with sufficient balance
- [X] should not be able to withdraw from an account with insufficient balance

### GET `/api/v1/statements/:statement_id`

- The route receives a JWT token by header and the id of a registered operation (withdrawal or deposit) in the route URL and returns the information of the operation found.
- [X] should be able to return the found deposit operation information
- [X] should be able to return the found withdraw operation information
- [X] should not be able to return a statement operation information when the user does not exist
- [X] should not be able to return a statement operation information when the statement does not exist
