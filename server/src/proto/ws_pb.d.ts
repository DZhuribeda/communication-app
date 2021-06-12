// package: songs
// file: ws.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class AddToRoomRequest extends jspb.Message {
  getNamespace(): string;
  setNamespace(value: string): AddToRoomRequest;
  getUserId(): string;
  setUserId(value: string): AddToRoomRequest;
  getRoom(): string;
  setRoom(value: string): AddToRoomRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddToRoomRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddToRoomRequest
  ): AddToRoomRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AddToRoomRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): AddToRoomRequest;
  static deserializeBinaryFromReader(
    message: AddToRoomRequest,
    reader: jspb.BinaryReader
  ): AddToRoomRequest;
}

export namespace AddToRoomRequest {
  export type AsObject = {
    namespace: string;
    userId: string;
    room: string;
  };
}

export class RemoveFromRoomRequest extends jspb.Message {
  getNamespace(): string;
  setNamespace(value: string): RemoveFromRoomRequest;
  getUserId(): string;
  setUserId(value: string): RemoveFromRoomRequest;
  getRoom(): string;
  setRoom(value: string): RemoveFromRoomRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveFromRoomRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RemoveFromRoomRequest
  ): RemoveFromRoomRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RemoveFromRoomRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): RemoveFromRoomRequest;
  static deserializeBinaryFromReader(
    message: RemoveFromRoomRequest,
    reader: jspb.BinaryReader
  ): RemoveFromRoomRequest;
}

export namespace RemoveFromRoomRequest {
  export type AsObject = {
    namespace: string;
    userId: string;
    room: string;
  };
}

export class EmitMessageRequest extends jspb.Message {
  getNamespace(): string;
  setNamespace(value: string): EmitMessageRequest;
  getUserId(): string;
  setUserId(value: string): EmitMessageRequest;
  getRoom(): string;
  setRoom(value: string): EmitMessageRequest;
  getEventName(): string;
  setEventName(value: string): EmitMessageRequest;
  getPayload(): string;
  setPayload(value: string): EmitMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmitMessageRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EmitMessageRequest
  ): EmitMessageRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: EmitMessageRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): EmitMessageRequest;
  static deserializeBinaryFromReader(
    message: EmitMessageRequest,
    reader: jspb.BinaryReader
  ): EmitMessageRequest;
}

export namespace EmitMessageRequest {
  export type AsObject = {
    namespace: string;
    userId: string;
    room: string;
    eventName: string;
    payload: string;
  };
}
