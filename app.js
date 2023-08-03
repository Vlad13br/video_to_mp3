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
    if (videoInfo.videoDetails.category === "Music") {
      const extra = {
        title: videoTitle,
        performer: videoInfo.videoDetails.keywords[0],
        duration: videoInfo.videoDetails.lengthSeconds,
        thumb: videoInfo.videoDetails.video_url,
      };
      return ctx.replyWithAudio({ source: audioReadableStream }, extra);
    }

    const extra = {
      title: videoTitle,
      duration: videoInfo.videoDetails.lengthSeconds,
    };
    ctx.replyWithAudio({ source: audioReadableStream }, extra);
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("Error");
  }
});

bot.launch();
