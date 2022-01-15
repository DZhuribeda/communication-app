export enum RoomActions {
  create = 'create',
  read = 'read',
  update = 'update',
  remove = 'remove',
}

export type Room = {
    id: string;
    name: string;
    members: number;
    slug: string;
    permissions: RoomActions[];
}