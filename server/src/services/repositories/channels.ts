import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import PrismaService from "../prisma";

@Service()
export class ChannelsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(creatorId: string, title: string): Promise<number> {
    const prisma = this.prismaService.getPrisma();
    const channel = await prisma.channel.create({
      data: {
        title,
        members: {
          create: {
            userId: creatorId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    return channel.id;
  }
  async update(channelId: number, title: string): Promise<void> {
    const prisma = this.prismaService.getPrisma();
    await prisma.channel.update({
      data: {
        title,
      },
      where: {
        id: channelId,
      },
    });
  }
  async delete(channelId: number): Promise<void> {
    const prisma = this.prismaService.getPrisma();
    await prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }

  get(channelId: number) {
    const prisma = this.prismaService.getPrisma();
    return prisma.channel.findUnique({
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: channelId,
      },
    });
  }

  list(userId: string, pageSize: number = 100, cursor?: number) {
    const prisma = this.prismaService.getPrisma();
    let query = {
      take: pageSize,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        members: {
          every: {
            userId: userId,
          },
        },
      },
      orderBy: {
        id: Prisma.SortOrder.asc,
      },
    };
    if (cursor) {
      return prisma.channel.findMany({
        ...query,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    }
    return prisma.channel.findMany(query);
  }
}
