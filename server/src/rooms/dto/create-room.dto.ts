import { Length } from 'class-validator';

export class CreateRoomDto {
  @Length(3, 20)
  name: string;
}
