import {
  IsAlpha,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
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
import { UserId } from "../decorators/userId";
import { ChannelsService } from "../services/channels";
import { ChannelsRepository } from "../services/repositories/channels";
import { CHANNEL_NAMESPACE, ChannelAction } from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

class ChannelDto {
  @IsDefined()
  @IsAlpha()
  title!: string;
}

class ChannelsListQuery {
  @IsOptional()
  @IsInt()
  @IsPositive()
  cursor!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize!: number;
}

@JsonController("/channels")
@Service()
export class ChannelsController {
  constructor(
    private channelsService: ChannelsService,
    private channelsRepository: ChannelsRepository
  ) {}

  @Get()
  getAll(@QueryParams() query: ChannelsListQuery, @UserId() userId: string) {
    return this.channelsRepository.list(userId, query.pageSize, query.cursor);
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.READ))
  @Get("/:channelId")
  getOne(@Param("channelId") channelId: number) {
    return this.channelsRepository.get(channelId);
  }

  @Authorized()
  @Post()
  @Redirect("/api/v1/channels/:channelId")
  async post(@Body() channelDto: ChannelDto, @UserId() userId: string) {
    const channelId = await this.channelsService.create(
      userId,
      channelDto.title
    );
    return {
      channelId,
    };
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.MANAGE))
  @OnUndefined(204)
  @Put("/:channelId")
  put(@Param("channelId") channelId: number, @Body() channelDto: ChannelDto) {
    return this.channelsService.update(channelId, channelDto.title);
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.OWN))
  @OnUndefined(204)
  @Delete("/:channelId")
  delete(@Param("channelId") channelId: number) {
    return this.channelsService.delete(channelId);
  }
}
