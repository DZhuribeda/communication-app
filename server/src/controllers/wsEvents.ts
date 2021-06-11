import {
  JsonController,
  Authorized,
  OnUndefined,
  Post,
} from "routing-controllers";
import { Service } from "typedi";

@JsonController("/_/api/v1/wsEvents/")
@Service()
export class ChannelsController {
  constructor() {}

  @Authorized()
  @OnUndefined(200)
  @Post("connect/")
  getAll() {
    console.log("connected");
  }
}
