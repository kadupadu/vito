import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  Client,
  GatewayIntentBits,
  ActivityType,
  Partials,
  AttachmentBuilder,
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.login(process.env.TOKEN).catch(console.error);

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = join(dirname(fileURLToPath(import.meta.url)), "./");
app.use(express.static(staticPath));
app.get("/", (req, res) => res.sendFile(join(staticPath, "index.htm")));
app.get("/invite", (req, res) =>
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=1198738973938434089&permissions=412317240384&scope=bot"
  )
);
app.post("/submit", (req, res) => {
  const { username, word } = req.body;
  const channel = client.channels.cache.get("1100294785316704310");
  channel.send(
    `New message submission <@1258396025354453054>!\nUsername: ${username}\nWord: ${word}`
  );
  return res.send("Message submitted!");
});


app.post("/brave-forgiveness", async (req, res) => {
  const payload = req.body;

  // Extract useful information from the payload
  const projectName = payload.project.name;
  const projectId = payload.project.id;
  const deploymentId = payload.deployment.id;
  const creatorName = payload.deployment.creator.name;
  const serviceName = payload.service.name;
  const environmentName = payload.environment.name;
  const status = payload.status;
  const timestamp = payload.timestamp;
  const commitHash = payload.deployment.meta.commitHash;
  const commitMessage = payload.deployment.meta.commitMessage;
  const commitAuthor = payload.deployment.meta.commitAuthor;

  // Create the message
  const message = `Deployment Notification:
**Project Name**: ${projectName}
**Project ID**: ${projectId}
**Deployment ID**: ${deploymentId}
**Service Name**: ${serviceName}
**Environment**: ${environmentName}
**Status**: ${status}
**Timestamp**: ${timestamp}
**Commit Hash**: ${commitHash}
**Commit Message**: ${commitMessage}
**Commit Author**: ${commitAuthor}
**Creator**: ${creatorName}`;
if (['REMOVED', "FAILED", "CRASHED"].includes(status)) {
    message += "\n<@1258396025354453054>";
  
}
  const channelId = '1088010112167313428'; 
  const channel = await client.channels.fetch(channelId);
  if (channel) {
    await channel.send(message);
  } else {
    console.error("Channel not found");
  }

  res.status(200).send("Webhook received");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
