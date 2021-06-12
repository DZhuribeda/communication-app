import { RedisClient } from "redis";
import { Service } from "typedi";
import { promisify } from "util";

@Service()
export class UsersService {
  getAsync: (key: string) => Promise<string | null>;
  constructor(private redisClient: RedisClient) {
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
  }

  // I know that should be in repository, I'll extract if that will be more logic here
  private getSocketKey(userId: string) {
    return `wsgateway:sockets:${userId}`;
  }
  async storeUserSocket(userId: string, socketId: string) {
    this.redisClient.set(this.getSocketKey(userId), socketId);
  }
  async getUserSocket(userId: string) {
    return this.getAsync(this.getSocketKey(userId));
  }
}
