import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import messages from "./messages.json" assert { type: "json" };
import translate from "google-translate-api-x";
import { MongoClient } from 'mongodb';
import schedule from 'node-schedule';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const mongoURI = 'mongodb+srv://pixdy:123Lmao@pixd.jpul8rs.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'discordMessages';
const collectionName = 'messages';

const mongoClient = new MongoClient(mongoURI);

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity({
    name: "vito",
    type: ActivityType.Listening,
  });
  import("./form.js");

  // Schedule task to delete old messages every night at midnight
  schedule.scheduleJob('0 0 * * *', async () => {
      try {
          await mongoClient.connect();
          const db = mongoClient.db(dbName);
          const collection = db.collection(collectionName);
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          await collection.deleteMany({ timestamp: { $lt: sevenDaysAgo } });
          console.log('Old messages deleted from MongoDB');
      } catch (error) {
          console.error('Error deleting old messages from MongoDB:', error);
      } finally {
          await mongoClient.close();
      }
  });
  
  // Store Discord messages from the specific channel in MongoDB
  client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.trim() === '') return;

    if (message.channel.id === '1128597323895808020') {
     let sendChan = client.channels.cache.get("1215640270222266368");
        // Probability of 1/10 for bot to send a message
        if (Math.random() < 0.1) {
            const randomMessage = gen(await getMessagesFromDB());
            return sendChan.send(randomMessage);
        }
        
        try {
            await mongoClient.connect();
            const db = mongoClient.db(dbName);
            const collection = db.collection(collectionName);
            await collection.insertOne({
                messageId: message.id,
                content: message.content,
                author: message.author.id,
                timestamp: message.createdTimestamp
            });
            console.log('Message stored in MongoDB');
        } catch (error) {
            console.error('Error storing message in MongoDB:', error);
        } finally {
            await mongoClient.close();
        }
    } 
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

// Function to fetch messages from MongoDB
async function getMessagesFromDB() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(dbName);
        const collection = db.collection(collectionName);
        const messages = await collection.find({}).toArray();
        return messages.map(msg => msg.content);
    } catch (error) {
        console.error('Error fetching messages from MongoDB:', error);
    } finally {
        await mongoClient.close();
    }
}

// Function to generate a random message from an array of messages
function gen(messages) {
  let length = rnum(25);
  let generatedMessage = [];
  
  let firstMessage = messages[rnum(messages.length)];
  let randomPart = getRandomPhrase(firstMessage);
  generatedMessage = generatedMessage.concat(randomPart.split(" "));
  
  while (generatedMessage.length <= length) {
    let lastWord = generatedMessage[generatedMessage.length - 1];
    
    let messagesWithLastWord = messages.filter(msg => msg.toLowerCase().includes(lastWord.toLowerCase()));
    let nextMessage = messagesWithLastWord[rnum(messagesWithLastWord.length)].split(" ");
    let lastWordPos = nextMessage.indexOf(lastWord);
    let wordsToJoin = rnum(2)+1;
    for (let i = 0; i < wordsToJoin; i++) {
      if (!nextMessage[lastWordPos+1+i]) break;
      generatedMessage.push(nextMessage[lastWordPos+1+i]);
    }
  }
  
  let x = Math.random() < 0.5;
  if (x) {
    generatedMessage.push(getRandomPhrase(messages[rnum(messages.length)]));
  } 
  
  return generatedMessage.join(" ");
}

function rnum(range) {
  return Math.floor(Math.random() * range);
}

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