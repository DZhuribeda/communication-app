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
    this.roomsRepository.addUserToRoom(room.id, userId, RoomRoles.owner);
    return room;
  }

  findAll(userId: string) {
    const rooms = this.roomsRepository.findAll(userId);
    return rooms.map((room) => this.getRoomRepresentation(room, userId));
  }

  findOne(id: number, userId: string) {
    const room = this.roomsRepository.findOne(id);
    return this.getRoomRepresentation(room, userId);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomsRepository.update(id, updateRoomDto.name);
  }

  remove(id: number) {
    return this.roomsRepository.remove(id);
  }

  addUserToRoom(roomId: number, userId: string) {
    return this.roomsRepository.addUserToRoom(roomId, userId, RoomRoles.member);
  }

  removeUserFromRoom(roomId: number, userId: string) {
    return this.roomsRepository.removeUserFromRoom(roomId, userId);
  }

  getRoomRepresentation(room: Room, userId: string) {
    if (!room) {
      return null;
    }
    const roomMembers = this.roomsRepository.getRoomMembers(room.id);
    const userRole = roomMembers.find(
      (member) => member.userId === userId,
    )?.role;
    return {
      ...room,
      members: roomMembers.length,
      permissions: userRole ? getRoleActions(userRole) : [],
    };
  }
}
