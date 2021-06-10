import fetch from "node-fetch";
import { TEST_CONFIG } from "./config";

export async function addChannelMember(
  token: string,
  channelId: number,
  memberId: string,
  role: string
) {
  const payload = {
    role,
    memberId,
  };
  console.log("channel member request", payload);
  const channelMemberResponse = await fetch(
    `${TEST_CONFIG.base_url}/api/v1/channels/${channelId}/members/`,
    {
      method: "post",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!channelMemberResponse.ok) {
    throw new Error(
      JSON.stringify(await channelMemberResponse.json(), null, 2)
    );
  }
  return channelMemberResponse.json();
}

export async function removeChannelMember(
  token: string,
  channelId: number,
  memberId: string
) {
  const channelMemberDeleteResponse = await fetch(
    `${TEST_CONFIG.base_url}/api/v1/channels/${channelId}/members/${memberId}/`,
    {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!channelMemberDeleteResponse.ok) {
    throw new Error(
      JSON.stringify(await channelMemberDeleteResponse.json(), null, 2)
    );
  }
}
