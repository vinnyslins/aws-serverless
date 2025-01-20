const { randomUUID } = require("node:crypto");
const { readFile, unlink, writeFile } = require("fs/promises");
const axios = require("axios");
const mamemaker = require("@erickwendel/meme-maker");

class Handler {
  static generateImagePath() {
    const filename = `${randomUUID()}.png`;
    return process.env.IS_OFFLINE ? filename : `/tmp/${filename}`;
  }

  static async saveImage(imageUrl, imagePath) {
    const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");
    return writeFile(imagePath, buffer);
  }

  static async generateImageBase64(imagePath) {
    return readFile(imagePath, "base64");
  }
}

module.exports.handler = async (event) => {
  const options = event.queryStringParameters;
  const inputImagePath = Handler.generateImagePath();
  const outputImagePath = Handler.generateImagePath();

  await Handler.saveImage(options.image, inputImagePath);

  await mamemaker({
    image: inputImagePath,
    outfile: outputImagePath,
    topText: options.topText,
    bottomText: options.bottomText,
  });

  const imageBuffer = await Handler.generateImageBase64(outputImagePath);

  await Promise.all([unlink(inputImagePath), unlink(outputImagePath)]);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `<img src="data:image/png;base64,${imageBuffer}" />`,
  };
};
