const aws = require("aws-sdk");

const s3config = {
  s3ForcePathStyle: true,
};

if (process.env.IS_OFFLINE) {
  // Not necessary when env vars are set
  // aws.config.update({
  //   credentials: {
  //     accessKeyId: "test",
  //     secretAccessKey: "test",
  //   },
  // });

  const host = process.env.LOCALSTACK_HOST || "localhost";
  s3config.endpoint = new aws.Endpoint(`http://${host}:4566`);
}

const s3 = new aws.S3(s3config);

module.exports = {
  s3,
};
