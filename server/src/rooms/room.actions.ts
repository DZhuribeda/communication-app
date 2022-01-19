import { RoomRoles } from './room.roles';

export enum RoomActions {
  create = 'create',
  read = 'read',
  update = 'update',
  remove = 'remove',
  produceAudio = 'produceAudio',
  produceVideo = 'produceVideo',
  consumeAudio = 'consumeAudio',
  consumeVideo = 'consumeVideo',
}

export function getRoleActions(role: RoomRoles): RoomActions[] {
  switch (role) {
    case RoomRoles.owner:
      return [
        RoomActions.read,
        RoomActions.update,
        RoomActions.remove,
        RoomActions.produceAudio,
        RoomActions.produceVideo,
        RoomActions.consumeAudio,
        RoomActions.consumeVideo,
      ];
    case RoomRoles.member:
    case RoomRoles.guest:
      return [
        RoomActions.read,
        RoomActions.produceAudio,
        RoomActions.produceVideo,
        RoomActions.consumeAudio,
        RoomActions.consumeVideo,
      ];
    default:
      throw new Error('user without role');
  }
}
