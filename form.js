import express from "express";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { client } from "./index.js";


const app = express();
const port = 3034;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = join(dirname(fileURLToPath(import.meta.url)), './');
app.use(express.static(staticPath));
app.get('/', (req, res) => res.sendFile(join(staticPath, 'index.htm')));
app.post("/submit", (req, res) => {
  const { username, word } = req.body;

  
  const channel = client.channels.cache.get("1100294785316704310"); 
  
    channel.send(`New message submission <@908287391217905684>!\nUsername: ${username}\nWord: ${word}`);
    return res.send('Message submitted!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
