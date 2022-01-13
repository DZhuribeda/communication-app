import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/entities/user';
import { AccessGuard, UseAbility } from 'nest-casl';
import { RoomActions } from './room.actions';
import { RoomWithUserRole } from './entities/room.entity';
import { RoomHook } from './rooms.hook';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AccessGuard)
  @UseAbility(RoomActions.create, RoomWithUserRole)
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: User) {
    return this.roomsService.create(createRoomDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.roomsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const room = this.roomsService.findOne(+id);
    if (!room) {
      throw new NotFoundException();
    }

    return this.roomsService.getRoomRepresentation(room, user.id);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(RoomActions.update, RoomWithUserRole, RoomHook)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(RoomActions.remove, RoomWithUserRole, RoomHook)
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }

  @Post(':id/users')
  addUserToRoom(@Param('id') id: string, @CurrentUser() user: User) {
    return this.roomsService.addUserToRoom(+id, user.id);
  }
}
