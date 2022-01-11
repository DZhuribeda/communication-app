import { RoomRoles } from './room.roles';

export enum RoomActions {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export function getRoleActions(role: RoomRoles): RoomActions[] {
  switch (role) {
    case RoomRoles.owner:
      return [RoomActions.read, RoomActions.update, RoomActions.delete];
    case RoomRoles.member:
      return [RoomActions.read];
    default:
      return [];
  }
}
