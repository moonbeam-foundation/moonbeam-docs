const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

class PullServiceClient {
  constructor(address) {
    var PROTO_PATH = __dirname + './client.proto';
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const pullProto =
      grpc.loadPackageDefinition(packageDefinition).pull_service;
    this.client = new pullProto.PullService(
      address,
      grpc.credentials.createSsl()
    );
  }

  getProof(request, callback) {
    this.client.getProof(request, callback);
  }
}

module.exports = PullServiceClient;
