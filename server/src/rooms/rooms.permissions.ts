import { Permissions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { RoomRoles } from './room.roles';
import { RoomWithUserRole } from './entities/room.entity';
import { RoomActions } from './room.actions';

export type Subjects = InferSubjects<typeof RoomWithUserRole>;

export const permissions: Permissions<RoomRoles, Subjects, RoomActions> = {
  everyone({ can }) {
    can(RoomActions.read, RoomWithUserRole);
    can(RoomActions.create, RoomWithUserRole);
    can(RoomActions.update, RoomWithUserRole, { userRole: RoomRoles.owner });
    can(RoomActions.remove, RoomWithUserRole, { userRole: RoomRoles.owner });
  },
};
