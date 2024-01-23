import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import messages from "./messages.json" assert { type: "json" };

export const client = new Client({
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
});

let i = 0;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.includes("t")) i++;

  if (
    message.content.toLowerCase().startsWith(`vito talk`) ||
    message.mentions.users.first()?.id == client.user.id ||
    i === 20
  ) {
    i = i === 20 ? 0 : i;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return message.channel.send(msg);
  }

  if (message.content.toLowerCase().startsWith(`vito say`)) {
    let msg = message.content.split(" ").splice(2).join(" ");
    if (msg == "") {
      return message.reply(
        "```Cannot send message because the message provided is undefined.```",
      );
    }
    try {
      await message.delete();
    } catch (e) {
      console.log(e.message);
    }
    return message.channel.send(msg);
  }
});

client.login(process.env.TOKEN);