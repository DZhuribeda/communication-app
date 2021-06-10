import {
  IsDefined,
  IsInt,
  IsOptional,
  IsEnum,
  Max,
  Min,
} from "class-validator";
import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  Redirect,
  OnUndefined,
  QueryParams,
} from "routing-controllers";
import { Service } from "typedi";
import { ChannelsService } from "../services/channels";
import { ChannelsRepository } from "../services/repositories/channels";
import {
  CHANNEL_NAMESPACE,
  ChannelAction,
  ChannelRole,
} from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

class ChannelMemberRoleDto {
  @IsDefined()
  @IsEnum(ChannelRole)
  role!: ChannelRole;
}

class ChannelMemberDto extends ChannelMemberRoleDto {
  @IsDefined()
  memberId!: string;
}

class ChannelMembersListQuery {
  @IsOptional()
  cursor!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize!: number;
}

@JsonController("/channels/:channelId/members/")
@Service()
export class ChannelsController {
  constructor(
    private channelsService: ChannelsService,
    private channelsRepository: ChannelsRepository
  ) {}

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.READ))
  @Get()
  getAll(
    @QueryParams() query: ChannelMembersListQuery,
    @Param("channelId") channelId: number
  ) {
    return this.channelsRepository.listMembers(
      channelId,
      query.pageSize,
      query.cursor
    );
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.READ))
  @Get(":memberId/")
  getOne(
    @Param("channelId") channelId: number,
    @Param("memberId") memberId: string
  ) {
    return this.channelsRepository.getMember(channelId, memberId);
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.MANAGE))
  @Post()
  @Redirect("/api/v1/channels/:channelId/members/:memberId/")
  async post(
    @Param("channelId") channelId: number,
    @Body() channelMemberDto: ChannelMemberDto
  ) {
    const memberId = channelMemberDto.memberId;
    await this.channelsService.addMember(
      channelId,
      memberId,
      channelMemberDto.role
    );
    return {
      channelId,
      memberId,
    };
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.MANAGE))
  @OnUndefined(204)
  @Put(":memberId/")
  put(
    @Param("channelId") channelId: number,
    @Param("memberId") memberId: string,
    @Body() channelMemberRoleDto: ChannelMemberRoleDto
  ) {
    return this.channelsService.changeMemberRole(
      channelId,
      memberId,
      channelMemberRoleDto.role
    );
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.MANAGE))
  @OnUndefined(204)
  @Delete(":memberId/")
  delete(
    @Param("channelId") channelId: number,
    @Param("memberId") memberId: string
  ) {
    return this.channelsService.deleteMember(channelId, memberId);
  }
}
