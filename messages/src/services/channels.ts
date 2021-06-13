import { Service } from "typedi";
import { ChannelsRepository } from "./repositories/channels";
import { ChannelRole, ChannelsRBACService } from "./rbac/channels";

import { WebsocketsService } from "./ws";
import { getChannelRoom } from "../utils/channels";
import { Logger, LoggerInterface } from "../decorators/logger";

@Service()
export class ChannelsService {
  constructor(
    @Logger() private logger: LoggerInterface,
    private channelsRepository: ChannelsRepository,
    private channelsRBACService: ChannelsRBACService,
    private websocketsService: WebsocketsService
  ) {}

  async create(creatorId: string, title: string): Promise<number> {
    const channelId = await this.channelsRepository.create(
      creatorId,
      title,
      ChannelRole.OWNER
    );
    await this.channelsRBACService.setupRoles(channelId.toString());
    await this.channelsRBACService.setUserRole(
      channelId.toString(),
      creatorId,
      ChannelRole.OWNER
    );
    this.websocketsService.addToRoom(creatorId, getChannelRoom(channelId));

    return channelId;
  }

  async update(channelId: number, title: string): Promise<void> {
    await this.channelsRepository.update(channelId, title);
  }

  async delete(channelId: number): Promise<void> {
    await this.channelsRepository.delete(channelId);
    await this.channelsRBACService.deleteRoles(channelId.toString());
  }

  async addMember(channelId: number, memberId: string, role: ChannelRole) {
    await this.channelsRepository.addMember(channelId, memberId, role);
    await this.channelsRBACService.setUserRole(
      channelId.toString(),
      memberId,
      role
    );
    this.websocketsService.addToRoom(memberId, getChannelRoom(channelId));
  }

  async changeMemberRole(
    channelId: number,
    memberId: string,
    role: ChannelRole
  ) {
    const memberInfo = await this.channelsRepository.getMember(
      channelId,
      memberId
    );
    if (!memberInfo) {
      return;
    }
    await this.channelsRepository.changeMemberRole(channelId, memberId, role);
    await this.channelsRBACService.setUserRole(
      channelId.toString(),
      memberId,
      role,
      memberInfo.role
    );
  }

  async deleteMember(channelId: number, memberId: string) {
    const memberInfo = await this.channelsRepository.getMember(
      channelId,
      memberId
    );
    if (!memberInfo) {
      return;
    }
    await this.channelsRepository.deleteMember(channelId, memberId);
    await this.channelsRBACService.setUserRole(
      channelId.toString(),
      memberId,
      null,
      memberInfo.role
    );
    this.websocketsService.removeFromRoom(memberId, getChannelRoom(channelId));
  }

  async subcribesUserToChannels(userId: string) {
    const channelsBatchSize = 100;
    let cursorId = null;
    let channels = await this.channelsRepository.list(
      userId,
      channelsBatchSize
    );
    // TODO: change to generator
    while (channels.length === channelsBatchSize && cursorId !== null) {
      channels.forEach((c) => {
        const channelRoom = getChannelRoom(c.id);
        this.logger.info("User joined to room", { channelRoom });
        this.websocketsService.addToRoom(userId, channelRoom);
      });
      cursorId = channels[channels.length - 1];
    }
  }
}
