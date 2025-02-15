const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toggle-banned-words")
    .setDescription(
      "Toggle wether you want to turn on banned words for your server or not!"
    )
    .addStringOption((option) =>
      option
        .setName("toggle-value")
        .setDescription("wether to turn on or off")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  global: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    )
      return await interaction.reply({
        content:
          'You dont have the permissions to toggle banned words. You need the "ManageGuild" permission!',
        ephemeral: true,
      });

    const toggle = await interaction.options.getString("toggle-value");

    await client.F.addData("banned-words", interaction.guildId, {
      toggleValue: toggle,
    });

    return await interaction.reply({
      content: `Toggled banned words to ${toggle}!`,
    });
  },
};

console.log("set-banned.js run");
