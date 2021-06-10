import { Service } from "typedi";
import { BaseRBACService } from "./rbac";

export const CHANNEL_NAMESPACE = "channels";

export enum ChannelRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  WRITER = "WRITER",
  READER = "READER",
}
export enum ChannelAction {
  DELETE = "DELETE",
  MANAGE = "MANAGE",
  WRITE = "WRITE",
  READ = "READ",
}

@Service()
export class ChannelsRBACService extends BaseRBACService {
  namespace = CHANNEL_NAMESPACE;
  actions = Object.values(ChannelAction);
  rolesMapping = {
    [ChannelRole.OWNER]: [
      ChannelAction.DELETE,
      ChannelAction.MANAGE,
      ChannelAction.WRITE,
      ChannelAction.READ,
    ],
    [ChannelRole.MANAGER]: [
      ChannelAction.MANAGE,
      ChannelAction.WRITE,
      ChannelAction.READ,
    ],
    [ChannelRole.WRITER]: [ChannelAction.WRITE, ChannelAction.READ],
    [ChannelRole.READER]: [ChannelAction.READ],
  };
}
