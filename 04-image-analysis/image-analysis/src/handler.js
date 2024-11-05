const axios = require("axios");

module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async getImageBuffer(imageUrl) {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data, "base64");
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const items = result.Labels.filter(({ Confidence }) => Confidence > 80);
    const labels = items.map(({ Name }) => Name).join(",");

    return { items, labels };
  }

  async translateLabels(labels) {
    const { TranslatedText } = await this.translatorSvc
      .translateText({
        Text: labels,
        SourceLanguageCode: "en",
        TargetLanguageCode: "pt",
      })
      .promise();

    return TranslatedText.split(",");
  }

  formatResults(labels, items) {
    return labels
      .map((label, index) => {
        const item = items[index];
        return `${item.Confidence.toFixed(2)}% de ser ${label
          .trim()
          .toLowerCase()}`;
      })
      .join("\n");
  }

  async main(event) {
    try {
      const {
        queryStringParameters: { imageUrl },
      } = event;

      if (!imageUrl) {
        return {
          statusCode: 400,
          body: "Missing imageUrl parameter",
        };
      }

      console.log("Downloading image...");

      const buffer = await this.getImageBuffer(imageUrl);

      console.log("Detecting labels from image...");

      const { items, labels } = await this.detectImageLabels(buffer);

      console.log("Translating labels to portuguese...");

      const translatedLabels = await this.translateLabels(labels);
      const finalText = this.formatResults(translatedLabels, items);

      console.log("Finishing...");

      return {
        statusCode: 200,
        body: `A imagem tem\n${finalText}`,
      };
    } catch (error) {
      console.error(error);

      return {
        statusCode: 500,
        body: "Internal error",
      };
    }
  }
};
