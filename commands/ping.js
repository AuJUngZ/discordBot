const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");

    // Log the command usage to the console
    console.table({
      User: `${interaction.user.tag}`,
      Command: "ping",
      "Time Used": `${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
      })}`,
    });
  },
};
