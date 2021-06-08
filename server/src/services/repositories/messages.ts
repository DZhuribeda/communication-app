import { Service } from "typedi";
import PrismaService from "../prisma";

@Service()
export class MessagesRepository {
  constructor(private prismaService: PrismaService) {}

  create(creatorId: string, channelId: number, text: string) {
    const prisma = this.prismaService.getPrisma();
    return prisma.message.create({
      select: {
        id: true,
      },
      data: {
        channel: {
          connect: {
            id: channelId,
          },
        },
        userId: creatorId,
        text,
      },
    });
  }
}
