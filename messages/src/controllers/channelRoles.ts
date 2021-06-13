import { JsonController, Get } from "routing-controllers";
import { Service } from "typedi";
import {
  CHANNEL_NAMESPACE,
  ChannelAction,
  ChannelsRBACService,
} from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

@JsonController("/api/v1/channels/:channelId/roles/")
@Service()
export class ChannelRolesController {
  constructor(private channelsRBACService: ChannelsRBACService) {}

  @Get(createRole(CHANNEL_NAMESPACE, ChannelAction.READ))
  getAll() {
    return {
      actions: this.channelsRBACService.actions,
      rolesMapping: this.channelsRBACService.rolesMapping,
    };
  }
}
