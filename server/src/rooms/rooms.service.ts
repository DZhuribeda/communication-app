import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  rooms = [
    {
      id: 'testing',
    },
  ];

  async getRoomById(id: string) {
    return this.rooms.find((room) => room.id === id);
  }

  async getUserRoom() {
    return this.rooms[0];
  }
}
