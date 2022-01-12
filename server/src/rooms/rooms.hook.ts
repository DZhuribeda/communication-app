import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { RoomsService } from './rooms.service';
import { RoomWithUserRole } from './entities/room.entity';

@Injectable()
export class RoomHook
  implements SubjectBeforeFilterHook<RoomWithUserRole, Request>
{
  constructor(readonly roomsService: RoomsService) {}

  async run(request: Request) {
    const userId = request.user?.id;
    const room = this.roomsService.findOne(+request.params.id);
    return {
      ...room,
      userRole: this.roomsService.getUserRoomRole(room.id, userId),
    };
  }
}
