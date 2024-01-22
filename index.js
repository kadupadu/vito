import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import messages from "./messages.json" assert { type: "json" };;


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

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.includes("t")) i++;

  if (
    message.content.toLowerCase().startsWith(`vito talk`) ||
    message.mentions.users.first()?.id == client.user.id ||
    i === 25
  ) {
    i = 0;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return message.channel.send(msg);
  }

  if (message.content.toLowerCase().startsWith(`vito say`)) {
    if (msg == "") {
      return message.reply(
        "```Cannot send message because the message provided is undefined.```",
      );
    }
    let msg = message.content.split(" ").splice(2).join(" ");
    message.delete();
    return message.channel.send(msg);
  }
});


client.login(process.env.TOKEN);
