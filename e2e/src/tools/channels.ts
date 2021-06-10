import faker from "faker";
import fetch from "node-fetch";
import { TEST_CONFIG } from "./config";

export async function createChannel(token: string) {
  const payload = {
    title: faker.lorem.slug(),
  };
  console.log('channel request', payload);
  const channelResponse = await fetch(
    `${TEST_CONFIG.base_url}/api/v1/channels/`,
    {
      method: "post",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!channelResponse.ok) {
    throw new Error(JSON.stringify(await channelResponse.json(), null, 2));
  }
  return channelResponse.json();
}
