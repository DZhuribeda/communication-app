import { JsonController, Get, CurrentUser } from 'routing-controllers';
import { UserId } from '../decorators/userId';
import { User } from '../interfaces/user';

@JsonController()
export class TestController {
  @Get('/tests')
  async getTest(
    @CurrentUser() user: User,
    @UserId() userId: string,
  ) {
    return {
      data: user,
      userId,
    };
  }
}