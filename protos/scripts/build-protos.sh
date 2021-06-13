#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

function build_proto {
  proto_files=$1
  dest=$2

  rm -rf ${dest}
  mkdir -p ${dest}

  npx grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:${dest} \
  --ts_out=grpc_js:${dest} \
  --grpc_out=grpc_js:${dest} \
  --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
  -I ./proto \
  $proto_files
} 

build_proto proto/ws.proto ./../ws-gateway/src/proto
build_proto proto/ws.proto ./../messages/src/proto