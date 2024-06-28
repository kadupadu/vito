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
  client.user.setActivity({ name: "vito", type: ActivityType.Listening });
  import("./form.js");
  
  // Define client.uptime using Date.now()
  client.uptime = Date.now();
  
  let messageCounter = 0;
  
  client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.trim() === '') return;

    if (message.content.toLowerCase().includes("t")) messageCounter++;

    if (message.content.toLowerCase().startsWith('vito talk') || messageCounter === 20) {
      messageCounter = messageCounter === 20 ? 0 : messageCounter;
      message.channel.send(getRandomMessage(messages)).catch(console.error);
    }

    if (message.content.toLowerCase().startsWith('vito say')) {
      const msgContent = message.content.split(" ").splice(2).join(" ");
      if (!msgContent) {
        message.channel.send("```Cannot send message because the message provided is undefined.```").catch(console.error);
        return;
      }
      try { await message.delete(); } catch (error) { console.error(error.message); }
      message.channel.send(msgContent).catch(console.error);
    }

    if (message.content.toLowerCase().startsWith('vito ping')) {
      const msg = await message.channel.send("Pong!");
      const uptime = formatUptime(Date.now() - client.uptime);
      msg.edit({
        content: "Pong!",
        embeds: [{
          color: client.color || 0x00FF00,
          description: `**Latency:** \`${msg.createdTimestamp - message.createdTimestamp}ms\`\n**API Latency:** \`${Math.round(client.ws.ping)}ms\`\n**Uptime:** ${uptime}`,
        }]
      }).catch(console.error);
    }
  });
});

client.login(process.env.TOKEN).catch(console.error);

function getRandomMessage(messageArray) {
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  return messageArray[randomIndex];
}

function formatUptime(uptime) {
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}