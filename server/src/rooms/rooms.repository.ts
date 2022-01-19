import { Injectable } from '@nestjs/common';
import { Room, RoomMember } from './entities/room.entity';
import { RoomRoles } from './room.roles';

@Injectable()
export class RoomsRepository {
  private rooms = [] as Array<Room>;
  private roomMembers = [] as Array<RoomMember>;

  create(name: string, slug: string) {
    this.rooms.push({
      id: this.rooms.length + 1,
      name,
      slug,
    });
    return this.rooms[this.rooms.length - 1];
  }

  findAll(userId) {
    const membershipRoomIds = this.roomMembers
      .filter((m) => m.userId === userId)
      .map((m) => m.roomId);
    return this.rooms.filter((room) => membershipRoomIds.includes(room.id));
  }

  findOne(id: number) {
    return this.rooms.find((room) => room.id === id);
  }

  findBySlug(slug: string) {
    return this.rooms.find((room) => room.slug === slug);
  }

  update(slug: string, name: string) {
    const room = this.findBySlug(slug);
    room.name = name;
  }

  remove(slug: string) {
    this.rooms = this.rooms.filter((room) => room.slug !== slug);
  }

  addUserToRoom(slug: string, userId: string, role: RoomRoles) {
    const room = this.findBySlug(slug);
    this.roomMembers.push({
      roomId: room.id,
      userId,
      role,
    });
  }

  removeUserFromRoom(roomId: number, userId: string) {
    this.roomMembers = this.roomMembers.filter(
      (member) => !(member.roomId === roomId && member.userId === userId),
    );
  }

  getRoomMembers(roomId: number) {
    return this.roomMembers.filter((member) => member.roomId === roomId);
  }
}
