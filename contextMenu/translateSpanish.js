const {
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  Client,
  EmbedBuilder,
} = require("discord.js");
const translate = require("@vitalets/google-translate-api");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("translate-to-spanish")
    .setType(ApplicationCommandType.Message),
  /**
   *
   * @param {MessageContextMenuCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const msg = interaction.targetMessage.content;

    if (!msg)
      return await interaction.reply({
        content: "Cant translate embeds!",
        ephemeral: true,
      });

    const inSpanish = await translate(msg, { to: "spanish" })
      .then((res) => res.text)
      .catch((e) => console.log(e));

    const embed = new EmbedBuilder()
      .setTitle("Translate")
      .setDescription("Translate text to Spanish.")
      .addFields(
        {
          name: "Original Text",
          value: `\`\`\`${msg}\`\`\``,
        },
        { name: "Translated to Spanish", value: `\`\`\`${inSpanish}\`\`\`` }
      )
      .setColor("Blue")
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({ name: interaction.user.tag })
      .setTimestamp()
      .setFooter({
        text: "Translate to Spanish • Alienbot",
        iconURL:
          "https://cdn.discordapp.com/app-icons/800089810525356072/b8b1bd81f906b2c309227c1f72ba8264.png?size=64&quot",
      });

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

console.log("translateSpanish.js run");
