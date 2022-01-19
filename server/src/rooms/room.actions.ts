import { RoomRoles } from './room.roles';

export enum RoomActions {
  create = 'create',
  read = 'read',
  update = 'update',
  remove = 'remove',
}

export function getRoleActions(role: RoomRoles): RoomActions[] {
  switch (role) {
    case RoomRoles.owner:
      return [RoomActions.read, RoomActions.update, RoomActions.remove];
    case RoomRoles.member:
    case RoomRoles.guest:
      return [RoomActions.read];
    default:
      return [];
  }
}
