const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");

    // Log the command usage to the console
    console.log(`
    * ********************************************* *
      ${interaction.user.tag} used the ping command
    * ********************************************* *
    `);
  },
};
