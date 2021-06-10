import { Prisma } from "@prisma/client";
import { Service } from "typedi";
import PrismaService from "../prisma";

@Service()
export class ChannelsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(
    creatorId: string,
    title: string,
    role: string
  ): Promise<number> {
    const prisma = this.prismaService.getPrisma();
    const channel = await prisma.channel.create({
      data: {
        title,
        members: {
          create: {
            role,
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

  listMembers(channelId: number, pageSize: number = 100, cursor?: string) {
    const prisma = this.prismaService.getPrisma();
    let query = {
      take: pageSize,
      select: {
        userId: true,
        role: true,
      },
      where: {
        channelId,
      },
      orderBy: {
        channelId: Prisma.SortOrder.asc,
        userId: Prisma.SortOrder.asc,
      },
    };
    if (cursor) {
      return prisma.channelMember.findMany({
        ...query,
        skip: 1,
        cursor: {
          channelId_userId: {
            channelId: channelId,
            userId: cursor,
          },
        },
      });
    }
    return prisma.channelMember.findMany(query);
  }

  getMember(channelId: number, userId: string) {
    const prisma = this.prismaService.getPrisma();
    return prisma.channelMember.findUnique({
      select: {
        userId: true,
        role: true,
      },
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });
  }

  async addMember(channelId: number, memberId: string, role: string) {
    const prisma = this.prismaService.getPrisma();
    await prisma.channelMember.create({
      data: {
        userId: memberId,
        role,
        channel: {
          connect: {
            id: channelId,
          },
        },
      },
    });
  }

  async changeMemberRole(channelId: number, memberId: string, role: string) {
    const prisma = this.prismaService.getPrisma();
    await prisma.channelMember.update({
      where: {
        channelId_userId: {
          channelId,
          userId: memberId,
        },
      },
      data: {
        role,
      },
    });
  }

  async deleteMember(channelId: number, memberId: string) {
    const prisma = this.prismaService.getPrisma();
    await prisma.channelMember.delete({
      where: {
        channelId_userId: {
          channelId,
          userId: memberId,
        },
      },
    });
  }
}
