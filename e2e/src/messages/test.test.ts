import fetch from "node-fetch";
import { TEST_CONFIG } from "../tools/config";
import { createUser, loginUser } from "../tools/user";

test("test token", async () => {
  const user = await createUser();
  const token = await loginUser(user);

  expect(token).toBeDefined();
  const testResponse = await fetch(`${TEST_CONFIG.base_url}/api/v1/tests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  
  // TODO: use const
  expect(testResponse.status).toEqual(200);
});
