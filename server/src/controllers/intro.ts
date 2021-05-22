import { JsonController, Get } from "routing-controllers";
import { UserId } from "../decorators/userId";

@JsonController()
export class IntroController {
  @Get("/")
  async getIntro(@UserId() userId: string) {
    return {
      userId,
    };
  }
}
