import fetch from "node-fetch";
import faker from "faker";

import { TEST_CONFIG } from "./config";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface AuthorizedUser extends User {
  token: string;
}

export async function createUser(): Promise<User> {
  const flow = await fetch(
    `${TEST_CONFIG.base_url}/.ory/kratos/public/self-service/registration/api`
  );
  if (!flow.ok) {
    throw new Error(JSON.stringify(await flow.json(), null, 2));
  }
  const flowData = await flow.json();
  const actionURL = flowData.ui.action;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const userInfo = {
    password: faker.internet.password(),
    "traits.email": faker.internet.email(firstName, lastName),
    "traits.name.first": firstName,
    "traits.name.last": lastName,
  };
  const payload = {
    method: "password",
    ...userInfo,
  };
  const userRegistrationResponse = await fetch(actionURL, {
    method: "post",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  if (!userRegistrationResponse.ok) {
    throw new Error(JSON.stringify(await userRegistrationResponse.json(), null, 2));
  }

  const userRegistrationData = await userRegistrationResponse.json();
  // TODO: that's error sometimes, faker generate not so random user, we should add clean up if helper was used.

  return {
    id: userRegistrationData.identity.id,
    firstName,
    lastName,
    email: payload["traits.email"],
    password: payload.password,
  };
}

export async function loginUser(user: User): Promise<string> {
  const flow = await fetch(
    `${TEST_CONFIG.base_url}/.ory/kratos/public/self-service/login/api`
  );
  if (!flow.ok) {
    throw new Error(JSON.stringify(await flow.json(), null, 2));
  }
  const flowData = await flow.json();
  const actionURL = flowData.ui.action;
  const payload = {
    method: "password",
    password_identifier: user.email,
    password: user.password,
  };
  const userLoginResponse = await fetch(actionURL, {
    method: "post",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  if (!userLoginResponse.ok) {
    throw new Error(JSON.stringify(await userLoginResponse.json(), null, 2));
  }

  const userLoginData = await userLoginResponse.json();
  return userLoginData.session_token;
}

export async function createAuthorizedUser(): Promise<AuthorizedUser> {
  const user = await createUser();
  const token = await loginUser(user);
  return {
    ...user,
    token,
  };
}
