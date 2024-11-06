const { s3 } = require("./factory");

module.exports.main = async (event) => {
  const allBuckets = await s3.listBuckets().promise();
  console.log("Found buckets", allBuckets);

  return {
    statusCode: 200,
    body: JSON.stringify({
      allBuckets,
    }),
  };
};
