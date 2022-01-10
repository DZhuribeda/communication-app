import { Injectable } from '@nestjs/common';
import { throws } from 'assert';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsRepository {
  private rooms = [] as Array<Room>;

  create(name: string, slug: string) {
    this.rooms.push({
      id: this.rooms.length + 1,
      name,
      slug,
    });
    return this.rooms[this.rooms.length - 1];
  }

  findAll() {
    return this.rooms;
  }

  findOne(id: number) {
    return this.rooms.find((room) => room.id === id);
  }

  update(id: number, name: string) {
    const room = this.findOne(id);
    room.name = name;
  }

  remove(id: number) {
    this.rooms = this.rooms.filter((room) => room.id !== id);
  }
}
