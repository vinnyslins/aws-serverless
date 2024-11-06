const { s3 } = require("./factory");

module.exports.hello = async (event) => {
  const allBuckets = await s3.listBuckets().promise();
  console.log("Found buckets", allBuckets);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v3.0! Your function executed successfully!",
    }),
  };
};
