import { RoomRoles } from '../room.roles';
export class Room {
  id: number;
  name: string;
  slug: string;
}

export class RoomWithUserRole extends Room {
  userRole: RoomRoles;
}

export class RoomMember {
  roomId: number;
  userId: string;
  role: RoomRoles;
}
