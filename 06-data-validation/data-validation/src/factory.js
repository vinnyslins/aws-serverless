const aws = require("aws-sdk");

if (process.env.IS_OFFLINE) {
  aws.config.update({
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
  });
}

const dynamodb = new aws.DynamoDB.DocumentClient({
  endpoint: process.env.IS_OFFLINE
    ? new aws.Endpoint("http://localhost:4566")
    : undefined,
});

module.exports = {
  dynamodb,
};
