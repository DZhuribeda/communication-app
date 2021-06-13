// package: songs
// file: ws.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as ws_pb from "./ws_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IWebsocketsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    addToRoom: IWebsocketsService_IAddToRoom;
    removeFromRoom: IWebsocketsService_IRemoveFromRoom;
    emitMessage: IWebsocketsService_IEmitMessage;
}

interface IWebsocketsService_IAddToRoom extends grpc.MethodDefinition<ws_pb.AddToRoomRequest, google_protobuf_empty_pb.Empty> {
    path: "/songs.Websockets/AddToRoom";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ws_pb.AddToRoomRequest>;
    requestDeserialize: grpc.deserialize<ws_pb.AddToRoomRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IWebsocketsService_IRemoveFromRoom extends grpc.MethodDefinition<ws_pb.RemoveFromRoomRequest, google_protobuf_empty_pb.Empty> {
    path: "/songs.Websockets/RemoveFromRoom";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ws_pb.RemoveFromRoomRequest>;
    requestDeserialize: grpc.deserialize<ws_pb.RemoveFromRoomRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IWebsocketsService_IEmitMessage extends grpc.MethodDefinition<ws_pb.EmitMessageRequest, google_protobuf_empty_pb.Empty> {
    path: "/songs.Websockets/EmitMessage";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ws_pb.EmitMessageRequest>;
    requestDeserialize: grpc.deserialize<ws_pb.EmitMessageRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const WebsocketsService: IWebsocketsService;

export interface IWebsocketsServer extends grpc.UntypedServiceImplementation {
    addToRoom: grpc.handleUnaryCall<ws_pb.AddToRoomRequest, google_protobuf_empty_pb.Empty>;
    removeFromRoom: grpc.handleUnaryCall<ws_pb.RemoveFromRoomRequest, google_protobuf_empty_pb.Empty>;
    emitMessage: grpc.handleUnaryCall<ws_pb.EmitMessageRequest, google_protobuf_empty_pb.Empty>;
}

export interface IWebsocketsClient {
    addToRoom(request: ws_pb.AddToRoomRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addToRoom(request: ws_pb.AddToRoomRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addToRoom(request: ws_pb.AddToRoomRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    removeFromRoom(request: ws_pb.RemoveFromRoomRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    removeFromRoom(request: ws_pb.RemoveFromRoomRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    removeFromRoom(request: ws_pb.RemoveFromRoomRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    emitMessage(request: ws_pb.EmitMessageRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    emitMessage(request: ws_pb.EmitMessageRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    emitMessage(request: ws_pb.EmitMessageRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class WebsocketsClient extends grpc.Client implements IWebsocketsClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public addToRoom(request: ws_pb.AddToRoomRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addToRoom(request: ws_pb.AddToRoomRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addToRoom(request: ws_pb.AddToRoomRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public removeFromRoom(request: ws_pb.RemoveFromRoomRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public removeFromRoom(request: ws_pb.RemoveFromRoomRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public removeFromRoom(request: ws_pb.RemoveFromRoomRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public emitMessage(request: ws_pb.EmitMessageRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public emitMessage(request: ws_pb.EmitMessageRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public emitMessage(request: ws_pb.EmitMessageRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
