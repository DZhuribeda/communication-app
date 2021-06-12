// GENERATED CODE -- DO NOT EDIT!

"use strict";
var grpc = require("@grpc/grpc-js");
var ws_pb = require("./ws_pb.js");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb.js");

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error("Expected argument of type google.protobuf.Empty");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

function serialize_songs_AddToRoomRequest(arg) {
  if (!(arg instanceof ws_pb.AddToRoomRequest)) {
    throw new Error("Expected argument of type songs.AddToRoomRequest");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_songs_AddToRoomRequest(buffer_arg) {
  return ws_pb.AddToRoomRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_songs_EmitMessageRequest(arg) {
  if (!(arg instanceof ws_pb.EmitMessageRequest)) {
    throw new Error("Expected argument of type songs.EmitMessageRequest");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_songs_EmitMessageRequest(buffer_arg) {
  return ws_pb.EmitMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_songs_RemoveFromRoomRequest(arg) {
  if (!(arg instanceof ws_pb.RemoveFromRoomRequest)) {
    throw new Error("Expected argument of type songs.RemoveFromRoomRequest");
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_songs_RemoveFromRoomRequest(buffer_arg) {
  return ws_pb.RemoveFromRoomRequest.deserializeBinary(
    new Uint8Array(buffer_arg)
  );
}

var WebsocketsService = (exports.WebsocketsService = {
  addToRoom: {
    path: "/songs.Websockets/AddToRoom",
    requestStream: false,
    responseStream: false,
    requestType: ws_pb.AddToRoomRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_songs_AddToRoomRequest,
    requestDeserialize: deserialize_songs_AddToRoomRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  removeFromRoom: {
    path: "/songs.Websockets/RemoveFromRoom",
    requestStream: false,
    responseStream: false,
    requestType: ws_pb.RemoveFromRoomRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_songs_RemoveFromRoomRequest,
    requestDeserialize: deserialize_songs_RemoveFromRoomRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  emitMessage: {
    path: "/songs.Websockets/EmitMessage",
    requestStream: false,
    responseStream: false,
    requestType: ws_pb.EmitMessageRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_songs_EmitMessageRequest,
    requestDeserialize: deserialize_songs_EmitMessageRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
});

exports.WebsocketsClient = grpc.makeGenericClientConstructor(WebsocketsService);
