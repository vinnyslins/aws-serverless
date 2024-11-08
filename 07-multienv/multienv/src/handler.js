const { randomUUID } = require("crypto");
const axios = require("axios");
const cheerio = require("cheerio");

const settings = require("../config/settings");
const { dynamodb } = require("./factory");

class Handler {
  static async main(event) {
    console.log("Process initiated at", new Date().toISOString());

    const { data } = await axios.get(settings.API_COMMIT_MESSAGE_URL);

    const $ = cheerio.load(data);
    const [commitMessage] = $("#content").text().trim().split("\n");
    console.log("Commit message", commitMessage);

    const params = {
      TableName: settings.DB_TABLE_NAME,
      Item: {
        id: randomUUID(),
        commitMessage,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamodb.put(params).promise();

    console.log("Process finished at", new Date().toISOString());

    return {
      statusCode: 200,
    };
  }
}

module.exports = {
  scheduler: Handler.main,
};
