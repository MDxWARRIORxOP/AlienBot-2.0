const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const Config = require("./config.json");
const Firebase = require("./firebase.js");
const { Player } = require("discord-player");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

(async () => {
  const data = await Firebase.getData("db", "BANNED_WORDS");
  client.BANNED_WORDS = await data.WORDS;
})();

const player = new Player(client);

player.on("trackStart", (queue, track) => {
  const embed = new MessageEmbed()
    .setTitle("Play song")
    .setDescription(`Now playing **${track.title}**!`)
    .setColor("GREEN")
    .setAuthor({ name: client.user.tag })
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setFooter({
      text: "Music System • Alienbot",
      iconURL:
        "https://cdn.discordapp.com/app-icons/800089810525356072/b8b1bd81f906b2c309227c1f72ba8264.png?size=64&quot",
    });
    
  queue.metadata.channel.send({ embeds: [embed] });
});

client.P = player;
client.C = Config;
client.F = Firebase;

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, () => {
      event.execute(client);
    });
  } else {
    client.on(event.name, (...args) => {
      event.execute(...args, client);
    });
  }
}

client.login(client.C.TOKEN);
