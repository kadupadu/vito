import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import messages from "./messages.json" assert { type: "json" };
import translate from "google-translate-api-x";

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
   await client.user.setAvatar("https://iili.io/JEVVc5Q.gif");
  import("./form.js");
});

let i = 0;

client.on("messageCreate", async (message) => {
  if (message.channel.id === "1140305947852550275") {
  if (message.content !== "") {
    const webhook = await message.channel.createWebhook({
      name: message.member.displayName,
      avatar: message.member.displayAvatarURL({
        extension: "webp",
        forceStatic: true,
      }),
      reason: "allu",
    });

    const res = await translate(message.content, { to: "te" });
    await message.delete();
    await webhook.send(res.text);
    await webhook.delete();
  }
}

  if (message.author.bot) return;
  if (message.content.toLowerCase().includes("t")) i++;

  if (
    message.content.toLowerCase().startsWith(`vito talk`) ||
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