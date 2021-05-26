import { Service } from "typedi";
import PrismaService from "../prisma";

@Service()
export class ChannelsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(title: string): Promise<number> {
    const prisma = this.prismaService.getPrisma();
    const channel = await prisma.channel.create({
      data: {
        title,
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
}
