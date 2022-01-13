import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { permissions } from './rooms.permissions';
import { CaslModule } from 'nest-casl';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
  imports: [CaslModule.forFeature({ permissions })],
})
export class RoomsModule {}
