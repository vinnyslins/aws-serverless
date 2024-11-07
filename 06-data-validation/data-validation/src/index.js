const { randomUUID } = require("node:crypto");

const { dynamodb } = require("./factory");

const heroesInsert = async (event) => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: "Heroes",
    Item: {
      ...body,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    },
  };

  await dynamodb.put(params).promise();

  const insertedItem = await dynamodb
    .query({
      TableName: "Heroes",
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
};

const heroesTrigger = async (event) => {
  console.log("Event", event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v3.0! Your function executed successfully!",
    }),
  };
};

module.exports = {
  heroesInsert,
  heroesTrigger,
};
