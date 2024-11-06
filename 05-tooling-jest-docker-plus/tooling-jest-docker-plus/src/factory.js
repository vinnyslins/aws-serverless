const aws = require("aws-sdk");

const s3config = {
  s3ForcePathStyle: true,
};

if (process.env.IS_OFFLINE) {
  aws.config.update({
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
  });

  const host = "localhost";
  s3config.endpoint = new aws.Endpoint(`http://${host}:4566`);
}

const s3 = new aws.S3(s3config);

module.exports = {
  s3,
};
