const Handler = require("./handler");
const { dynamodb } = require("./factory");
const { decoratorValidator } = require("./utils");

const handler = new Handler({ dynamodbSvc: dynamodb });

const heroesInsert = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  "body"
);

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
