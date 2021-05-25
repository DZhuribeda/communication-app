import { Service } from "typedi";
import { ChannelsRepository } from "./repositories/channels";
import { ChannelRole, ChannelsRBACService } from "./rbac/channels";

@Service()
export class ChannelsService {
  constructor(
    private channelsRepository: ChannelsRepository,
    private channelsRBACService: ChannelsRBACService,
  ) { }
  
  async create(creatorId: string, title: string): Promise<number> {
    const channelId = await this.channelsRepository.create(title);
    await this.channelsRBACService.setupRoles(channelId.toString());
    await this.channelsRBACService.setUserRole(channelId.toString(), creatorId, ChannelRole.OWNER);

    return channelId;
  }
  
  async update(channelId: number, title: string): Promise<void> {
    await this.channelsRepository.update(channelId, title);
  }
  
  async delete(channelId: number): Promise<void> {
    await this.channelsRepository.delete(channelId);
    await this.channelsRBACService.deleteRoles(channelId.toString());
  }
}
