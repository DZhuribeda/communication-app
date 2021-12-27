import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, OnGatewayDisconnect } from '@nestjs/websockets';
import { DtlsParameters, MediaKind, RtpParameters, SctpCapabilities, RtpCapabilities } from 'mediasoup/node/lib/types';
import { WsJwtAuthGuard } from 'src/auth/ws-jwt-auth.guard';
import { MediaService } from './media.service';

@WebSocketGateway()
export class VideoGateway implements OnGatewayDisconnect{
  private readonly logger = new Logger(VideoGateway.name);
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(WsJwtAuthGuard)
  handleDisconnect(client: any) {
    if(!client?.user?.id) {
      this.logger.error('handleDisconnect client.user.id is null');
      return;
    }
    this.mediaService.deleteUserFromRooms(client.user.id,);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinToRoom')
  async handleMessage(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: any,
  ) {
    await this.mediaService.joinToRoom(client, client.user.id, roomId);
    const rtpCapabilities = await this.mediaService.getRtpCapabilities(roomId);
    return {
      roomId,
      participants: [],
      rtpCapabilities,
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('createWebRtcTransport')
  async createWebRtcTransport(
    @ConnectedSocket() client: any,
    @MessageBody() payload: {
      roomId: string,
      forceTcp : boolean,
      producing : boolean,
      consuming : boolean,
      sctpCapabilities : any,
    },
  ) {
    
    return this.mediaService.createWebRtcTransport(
      client.user.id,
      payload.roomId,
      payload.forceTcp,
      payload.producing,
      payload.consuming,
      payload.sctpCapabilities,
    );
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('connectWebRtcTransport')
  async connectWebRtcTransport(
    @ConnectedSocket() client: any,
    @MessageBody() payload: {
      roomId: string,
      transportId: string,
      dtlsParameters: DtlsParameters,
    },
  ) {
    return await this.mediaService.connectWebRtcTransport(
      client.user.id,
      payload.roomId,
      payload.transportId,
      payload.dtlsParameters,
    );
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('produce')
  async produce(
    @ConnectedSocket() client: any,
    @MessageBody() payload: {
      roomId: string,
      transportId: string,
      kind: MediaKind,
      rtpParameters: RtpParameters,
      appData: any
    }
  ) {
    return this.mediaService.produce(
      client.user.id,
      payload.roomId,
      payload.transportId,
      payload.kind,
      payload.rtpParameters,
      payload.appData,
    );
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() client: any,
    @MessageBody() payload: {
      roomId: string,
      displayName: string,
      rtpCapabilities: RtpCapabilities,
      sctpCapabilities: SctpCapabilities,
    }
  ) {
    return this.mediaService.join(
      client.user.id,
      payload.roomId,
      payload.displayName,
      payload.rtpCapabilities,
      payload.sctpCapabilities,
    );
  }
}
