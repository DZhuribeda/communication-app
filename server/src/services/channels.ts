import { Service } from "typedi";
import { ChannelsRepository } from "./repositories/channels";
import { ChannelRole, ChannelsRBACService } from "./rbac/channels";
import {
  channelCreatedEvent,
  userJoinedEvent,
  userDeletedEvent,
} from "../events/channels";

@Service()
export class ChannelsService {
  constructor(
    private channelsRepository: ChannelsRepository,
    private channelsRBACService: ChannelsRBACService
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
    channelCreatedEvent.emit({
      creatorId,
      channelId,
    });

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
    userJoinedEvent.emit({
      userId: memberId,
      channelId,
    });
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
    userDeletedEvent.emit({
      userId: memberId,
      channelId,
    });
  }
}
