import fetch from "node-fetch";
import faker from "faker";

import { TEST_CONFIG } from "./config";

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export async function createUser(): Promise<User> {
  const flow = await fetch(
    `${TEST_CONFIG.base_url}/.ory/kratos/public/self-service/registration/api`
  );
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

  const userRegistrationData = await userRegistrationResponse.json();
  // TODO: that's error sometimes, faker generate not so random user, we should add clean up if helper was used.
  // 
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

  const userLoginData = await userLoginResponse.json();
  return userLoginData.session_token;
}
