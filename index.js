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

let i;
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.trim() === '') return;

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
});

function getRandomPhrase(sentence) {
  let words = sentence.split(" ");
  let startingWordPos = rnum(words.length);
  let phraseLength = rnum(4)+1;
  let phrase = [];
  for (let i = 0; i < phraseLength; i++) {
    if (startingWordPos == words.length) break;
     phrase.push(words[startingWordPos + i]);
  }
  return phrase.join(" ").trim();
}