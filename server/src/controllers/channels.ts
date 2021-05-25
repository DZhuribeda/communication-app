import { IsAlpha, IsDefined } from "class-validator";
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
} from "routing-controllers";
import { Service } from "typedi";
import { UserId } from "../decorators/userId";
import { ChannelsService } from "../services/channels";
import { CHANNEL_NAMESPACE, ChannelAction } from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

class ChannelDto {
  @IsDefined()
  @IsAlpha()
  title!: string;
}

@JsonController("/channels")
@Service()
export class ChannelsController {
  constructor(private channelsService: ChannelsService) { }

  @Get()
  getAll() {
    return "This action returns all channels";
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.READ))
  @Get("/:channelId")
  getOne(@Param("channelId") channelId: number) {
    return "This action returns channel #" + channelId;
  }

  @Authorized()
  @Post()
  @Redirect("/:channelId")
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
