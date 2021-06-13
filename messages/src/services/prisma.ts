import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { Logger, LoggerInterface } from "../decorators/logger";

@Service()
export default class PrismaService {
  private prisma: PrismaClient;
  constructor(@Logger() private logger: LoggerInterface) {
    this.prisma = new PrismaClient();
  }
  async connect() {
    await this.prisma.$connect();
    this.logger.info("Prisma connected");
  }
  getPrisma(): PrismaClient {
    return this.prisma;
  }
}
