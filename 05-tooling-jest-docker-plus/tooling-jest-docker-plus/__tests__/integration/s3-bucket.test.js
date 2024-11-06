const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");

const { s3 } = require("../../src/factory");
const { main } = require("../../src/index");

describe("S3 bucket suite tests with localstack", () => {
  const bucketConfig = {
    Bucket: "test-bucket",
  };

  beforeAll(async () => {
    await s3.createBucket(bucketConfig).promise();
  });

  afterAll(async () => {
    await s3.deleteBucket(bucketConfig).promise();
  });

  it("should return an array with all s3 buckets", async () => {
    const expected = bucketConfig.Bucket;

    const response = await main();

    const {
      allBuckets: { Buckets },
    } = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(Buckets).toContainEqual(expect.objectContaining({ Name: expected }));
  });
});
