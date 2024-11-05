const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
});

const { main } = require("../../src");
const requestMock = require("../mocks/request.json");

describe("Image analyser test suite", () => {
  it("should analyse successfully the image returning the results", async () => {
    const expected = {
      statusCode: 200,
      body: "A imagem tem\n98.21% de ser comida\n98.21% de ser carne\n98.21% de ser carne de porco\n89.87% de ser ketchup",
    };

    const result = await main(requestMock);
    expect(result).toStrictEqual(expected);
  });

  it("should return 400 for an empty querystring", async () => {
    const expected = {
      statusCode: 400,
      body: "Missing imageUrl parameter",
    };

    const result = await main({ queryStringParameters: {} });
    expect(result).toStrictEqual(expected);
  });

  it("should return 500 for an invalid image url", async () => {
    const expected = {
      statusCode: 500,
      body: "Internal error",
    };

    const result = await main({
      queryStringParameters: {
        imageUrl: "test",
      },
    });
    expect(result).toStrictEqual(expected);
  });
});
