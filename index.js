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

  const prefixRegex = /^(vito|pajeeto)\s+/i;

  if (prefixRegex.test(message.content)) {
    const command = message.content.replace(prefixRegex, "").toLowerCase();

    if (command.startsWith("talk") || (command.startsWith("say") && message.content.includes("say")) || i === 10) {
      i = i === 10 ? 0 : i;

      if (command.startsWith("talk")) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        return message.channel.send(`${command} ${msg}`);
      } else if (command.startsWith("say")) {
        let msg = message.content.split(" ").splice(2).join(" ");
        if (msg == "") {
          return message.reply("```Cannot send message because the message provided is undefined.```");
        }

        try {
          await message.delete();
        } catch (e) {
          console.log(e.message);
        }

        return message.channel.send(msg);
      }
    }
  }
});


client.login(process.env.TOKEN);