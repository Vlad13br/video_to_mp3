const { Telegraf } = require("telegraf");
const ytdl = require("ytdl-core");
require("dotenv").config();

const telegramToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(telegramToken);

bot.on("text", async ctx => {
  try {
    const url = ctx.message.text;
    console.log(url);

    const videoInfo = await ytdl.getInfo(url);
    const audioReadableStream = ytdl(url, { quality: "highestaudio" });
    const videoTitle = videoInfo.videoDetails.title;
    const videoThumbnail = videoInfo.videoDetails.thumbnails[0].url;

    if (videoInfo.videoDetails.category === "Music") {
      const extra = {
        duration: videoInfo.videoDetails.lengthSeconds,
        title: videoTitle,
        thumb: { url: videoThumbnail },
      };
      return ctx.replyWithAudio(
        {
          source: audioReadableStream,
          filename: `${videoTitle}.mp3`,
        },
        extra
      );
    }
    ctx.replyWithAudio({
      source: audioReadableStream,
      filename: `${videoTitle}.mp3`,
      duration: videoInfo.videoDetails.lengthSeconds,
    });
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("Error");
  }
});

bot.launch();
