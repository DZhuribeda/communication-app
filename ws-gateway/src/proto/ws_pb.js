// source: ws.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require("google-protobuf");
var goog = jspb;
var global = Function("return this")();

var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb.js");
goog.object.extend(proto, google_protobuf_empty_pb);
goog.exportSymbol("proto.songs.AddToRoomRequest", null, global);
goog.exportSymbol("proto.songs.EmitMessageRequest", null, global);
goog.exportSymbol("proto.songs.RemoveFromRoomRequest", null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.songs.AddToRoomRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.songs.AddToRoomRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.songs.AddToRoomRequest.displayName = "proto.songs.AddToRoomRequest";
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.songs.RemoveFromRoomRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.songs.RemoveFromRoomRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.songs.RemoveFromRoomRequest.displayName =
    "proto.songs.RemoveFromRoomRequest";
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.songs.EmitMessageRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.songs.EmitMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.songs.EmitMessageRequest.displayName = "proto.songs.EmitMessageRequest";
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.songs.AddToRoomRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.songs.AddToRoomRequest.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.songs.AddToRoomRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.songs.AddToRoomRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        namespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
        userId: jspb.Message.getFieldWithDefault(msg, 2, ""),
        room: jspb.Message.getFieldWithDefault(msg, 3, ""),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.songs.AddToRoomRequest}
 */
proto.songs.AddToRoomRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.songs.AddToRoomRequest();
  return proto.songs.AddToRoomRequest.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.songs.AddToRoomRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.songs.AddToRoomRequest}
 */
proto.songs.AddToRoomRequest.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setNamespace(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setUserId(value);
        break;
      case 3:
        var value = /** @type {string} */ (reader.readString());
        msg.setRoom(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.songs.AddToRoomRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.songs.AddToRoomRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.songs.AddToRoomRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.songs.AddToRoomRequest.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getNamespace();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
  f = message.getRoom();
  if (f.length > 0) {
    writer.writeString(3, f);
  }
};

/**
 * optional string namespace = 1;
 * @return {string}
 */
proto.songs.AddToRoomRequest.prototype.getNamespace = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.AddToRoomRequest} returns this
 */
proto.songs.AddToRoomRequest.prototype.setNamespace = function (value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional string user_id = 2;
 * @return {string}
 */
proto.songs.AddToRoomRequest.prototype.getUserId = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.AddToRoomRequest} returns this
 */
proto.songs.AddToRoomRequest.prototype.setUserId = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};

/**
 * optional string room = 3;
 * @return {string}
 */
proto.songs.AddToRoomRequest.prototype.getRoom = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.AddToRoomRequest} returns this
 */
proto.songs.AddToRoomRequest.prototype.setRoom = function (value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.songs.RemoveFromRoomRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.songs.RemoveFromRoomRequest.toObject(
      opt_includeInstance,
      this
    );
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.songs.RemoveFromRoomRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.songs.RemoveFromRoomRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        namespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
        userId: jspb.Message.getFieldWithDefault(msg, 2, ""),
        room: jspb.Message.getFieldWithDefault(msg, 3, ""),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.songs.RemoveFromRoomRequest}
 */
proto.songs.RemoveFromRoomRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.songs.RemoveFromRoomRequest();
  return proto.songs.RemoveFromRoomRequest.deserializeBinaryFromReader(
    msg,
    reader
  );
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.songs.RemoveFromRoomRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.songs.RemoveFromRoomRequest}
 */
proto.songs.RemoveFromRoomRequest.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setNamespace(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setUserId(value);
        break;
      case 3:
        var value = /** @type {string} */ (reader.readString());
        msg.setRoom(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.songs.RemoveFromRoomRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.songs.RemoveFromRoomRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.songs.RemoveFromRoomRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.songs.RemoveFromRoomRequest.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getNamespace();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
  f = message.getRoom();
  if (f.length > 0) {
    writer.writeString(3, f);
  }
};

/**
 * optional string namespace = 1;
 * @return {string}
 */
proto.songs.RemoveFromRoomRequest.prototype.getNamespace = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.RemoveFromRoomRequest} returns this
 */
proto.songs.RemoveFromRoomRequest.prototype.setNamespace = function (value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional string user_id = 2;
 * @return {string}
 */
proto.songs.RemoveFromRoomRequest.prototype.getUserId = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.RemoveFromRoomRequest} returns this
 */
proto.songs.RemoveFromRoomRequest.prototype.setUserId = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};

/**
 * optional string room = 3;
 * @return {string}
 */
proto.songs.RemoveFromRoomRequest.prototype.getRoom = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.RemoveFromRoomRequest} returns this
 */
proto.songs.RemoveFromRoomRequest.prototype.setRoom = function (value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.songs.EmitMessageRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.songs.EmitMessageRequest.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.songs.EmitMessageRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.songs.EmitMessageRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        namespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
        userId: jspb.Message.getFieldWithDefault(msg, 2, ""),
        room: jspb.Message.getFieldWithDefault(msg, 3, ""),
        eventName: jspb.Message.getFieldWithDefault(msg, 4, ""),
        payload: jspb.Message.getFieldWithDefault(msg, 5, ""),
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.songs.EmitMessageRequest}
 */
proto.songs.EmitMessageRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.songs.EmitMessageRequest();
  return proto.songs.EmitMessageRequest.deserializeBinaryFromReader(
    msg,
    reader
  );
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.songs.EmitMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.songs.EmitMessageRequest}
 */
proto.songs.EmitMessageRequest.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString());
        msg.setNamespace(value);
        break;
      case 2:
        var value = /** @type {string} */ (reader.readString());
        msg.setUserId(value);
        break;
      case 3:
        var value = /** @type {string} */ (reader.readString());
        msg.setRoom(value);
        break;
      case 4:
        var value = /** @type {string} */ (reader.readString());
        msg.setEventName(value);
        break;
      case 5:
        var value = /** @type {string} */ (reader.readString());
        msg.setPayload(value);
        break;
      default:
        reader.skipField();
        break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.songs.EmitMessageRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter();
  proto.songs.EmitMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.songs.EmitMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.songs.EmitMessageRequest.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined;
  f = message.getNamespace();
  if (f.length > 0) {
    writer.writeString(1, f);
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(2, f);
  }
  f = message.getRoom();
  if (f.length > 0) {
    writer.writeString(3, f);
  }
  f = message.getEventName();
  if (f.length > 0) {
    writer.writeString(4, f);
  }
  f = message.getPayload();
  if (f.length > 0) {
    writer.writeString(5, f);
  }
};

/**
 * optional string namespace = 1;
 * @return {string}
 */
proto.songs.EmitMessageRequest.prototype.getNamespace = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.EmitMessageRequest} returns this
 */
proto.songs.EmitMessageRequest.prototype.setNamespace = function (value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};

/**
 * optional string user_id = 2;
 * @return {string}
 */
proto.songs.EmitMessageRequest.prototype.getUserId = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.EmitMessageRequest} returns this
 */
proto.songs.EmitMessageRequest.prototype.setUserId = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};

/**
 * optional string room = 3;
 * @return {string}
 */
proto.songs.EmitMessageRequest.prototype.getRoom = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.EmitMessageRequest} returns this
 */
proto.songs.EmitMessageRequest.prototype.setRoom = function (value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};

/**
 * optional string event_name = 4;
 * @return {string}
 */
proto.songs.EmitMessageRequest.prototype.getEventName = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.EmitMessageRequest} returns this
 */
proto.songs.EmitMessageRequest.prototype.setEventName = function (value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};

/**
 * optional string payload = 5;
 * @return {string}
 */
proto.songs.EmitMessageRequest.prototype.getPayload = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};

/**
 * @param {string} value
 * @return {!proto.songs.EmitMessageRequest} returns this
 */
proto.songs.EmitMessageRequest.prototype.setPayload = function (value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};

goog.object.extend(exports, proto.songs);
