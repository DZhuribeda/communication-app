import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { getRoleActions } from './room.actions';
import { RoomRoles } from './room.roles';
import { RoomsRepository } from './rooms.repository';

const generateRandomString = (myLength) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)],
  );

  const randomString = randomArray.join('');
  return randomString;
};

const generateRandomSlug = () => {
  return [
    generateRandomString(7),
    generateRandomString(7),
    generateRandomString(7),
  ].join('-');
};

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomsRepository) {}
  create(createRoomDto: CreateRoomDto, userId: string) {
    const room = this.roomsRepository.create(
      createRoomDto.name,
      generateRandomSlug(),
    );
    this.roomsRepository.addUserToRoom(room.slug, userId, RoomRoles.owner);
    return room;
  }

  findAll(userId: string) {
    const rooms = this.roomsRepository.findAll(userId);
    return rooms.map((room) => this.getRoomRepresentation(room, userId));
  }

  findOne(id: number) {
    return this.roomsRepository.findOne(id);
  }

  findBySlug(slug: string) {
    return this.roomsRepository.findBySlug(slug);
  }

  update(slug: string, updateRoomDto: UpdateRoomDto) {
    return this.roomsRepository.update(slug, updateRoomDto.name);
  }

  remove(slug: string) {
    return this.roomsRepository.remove(slug);
  }

  addUserToRoom(slug: string, userId: string) {
    return this.roomsRepository.addUserToRoom(slug, userId, RoomRoles.member);
  }

  removeUserFromRoom(roomId: number, userId: string) {
    return this.roomsRepository.removeUserFromRoom(roomId, userId);
  }

  getUserRoomRole(roomId: number, userId: string) {
    const roomMembers = this.roomsRepository.getRoomMembers(roomId);
    return (
      roomMembers.find((member) => member.userId === userId)?.role ??
      RoomRoles.guest
    );
  }

  getRoomRepresentation(room: Room, userId: string) {
    if (!room) {
      return null;
    }
    const roomMembers = this.roomsRepository.getRoomMembers(room.id);
    const userRole = this.getUserRoomRole(room.id, userId);
    return {
      ...room,
      members: roomMembers.length,
      permissions: userRole ? getRoleActions(userRole) : [],
    };
  }
}
