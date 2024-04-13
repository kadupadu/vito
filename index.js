import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import messages from "./messages.json" assert { type: "json" };

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity({
    name: "vito",
    type: ActivityType.Listening,
  });
  import("./form.js");

  let messageCounter = 0;

  client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.trim() === '') return;

    if (message.content.toLowerCase().includes("t")) messageCounter++;

    if (
      message.content.toLowerCase().startsWith(`vito talk`) ||
      messageCounter === 20
    ) {
      messageCounter = messageCounter === 20 ? 0 : messageCounter;
      const randomMsg = getRandomMessage(messages);
      return message.channel.send(randomMsg);
    }

    if (message.content.toLowerCase().startsWith(`vito say`)) {
      const msgContent = message.content.split(" ").splice(2).join(" ");
      if (!msgContent) {
        return message.reply("```Cannot send message because the message provided is undefined.```");
      }
      try {
        await message.delete();
      } catch (error) {
        console.log(error.message);
      }
      return message.channel.send(msgContent);
    }
  });
});

client.login(process.env.TOKEN);

function getRandomMessage(messageArray) {
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  return messageArray[randomIndex];
}