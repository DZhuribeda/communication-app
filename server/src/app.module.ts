import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from 'nest-casl';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    VideoModule,
    VideoModule,
    RoomsModule,
    CaslModule.forRoot({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
