import { SubEvent } from "sub-events";

export const channelCreatedEvent = new SubEvent<{
  creatorId: string;
  channelId: number;
}>();

export const userJoinedEvent = new SubEvent<{
  userId: string;
  channelId: number;
}>();

export const userDeletedEvent = new SubEvent<{
  userId: string;
  channelId: number;
}>();
