import { SubEvent } from "sub-events";

export const messageCreatedEvent = new SubEvent<{
  messageId: number;
  userId: string;
  channelId: number;
  text: string;
}>();
