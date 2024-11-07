const { randomUUID } = require("node:crypto");
const joi = require("@hapi/joi");

class Handler {
  constructor({ dynamodbSvc }) {
    this.dynamodbSvc = dynamodbSvc;
    this.dynamodbTable = "Heroes";
  }

  static validator() {
    return joi.object({
      name: joi.string().required().max(100).min(2),
      power: joi.string().required().max(20).min(2),
    });
  }

  async main(event) {
    const body = event.body;

    const params = this.prepareData(body);
    await this.dynamodbSvc.put(params).promise();

    const insertedItem = await this.dynamodbSvc
      .query({
        TableName: this.dynamodbTable,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": params.Item.id,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(insertedItem),
    };
  }

  prepareData(body) {
    return {
      TableName: "Heroes",
      Item: {
        ...body,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      },
    };
  }
}

module.exports = Handler;
