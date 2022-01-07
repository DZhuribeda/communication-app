import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { VideoGateway } from './video.gateway';
import { createWorker } from 'mediasoup';
import { Worker } from 'mediasoup/node/lib/Worker';
import { mediasoupConfig } from './config';

@Module({
  providers: [
    VideoGateway,
    MediaService,
    {
      provide: Worker,
      useFactory: async () => {
        return await createWorker({
          logLevel: mediasoupConfig.workerSettings.logLevel,
          logTags: mediasoupConfig.workerSettings.logTags,
          rtcMinPort: Number(mediasoupConfig.workerSettings.rtcMinPort),
          rtcMaxPort: Number(mediasoupConfig.workerSettings.rtcMaxPort),
        });
      },
    },
  ],
})
export class VideoModule {}
