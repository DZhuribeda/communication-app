import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
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
  create(createRoomDto: CreateRoomDto) {
    return this.roomsRepository.create(
      createRoomDto.name,
      generateRandomSlug(),
    );
  }

  findAll() {
    return this.roomsRepository.findAll();
  }

  findOne(id: number) {
    return this.roomsRepository.findOne(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomsRepository.update(id, updateRoomDto.name);
  }

  remove(id: number) {
    return this.roomsRepository.remove(id);
  }
}
