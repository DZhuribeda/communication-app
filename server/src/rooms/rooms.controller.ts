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

@UseGuards(JwtAuthGuard)
@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: User) {
    return this.roomsService.create(createRoomDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.roomsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const room = this.roomsService.findOne(+id, user.id);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }

  @Post(':id/users')
  addUserToRoom(@Param('id') id: string, @CurrentUser() user: User) {
    return this.roomsService.addUserToRoom(+id, user.id);
  }
}
