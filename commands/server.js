const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  async execute(interaction) {
    //if you want to use a function to format numbers, you can do it like this
    //value cannot be a number, it must be a string
    const str = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Server Info")
      .addFields(
        { name: "Server name", value: interaction.guild.name },
        {
          name: "Total members",
          value: str(interaction.guild.memberCount),
        }
      )
      .setTimestamp();
    await interaction.reply({
      embeds: [embed],
    });

    // Log the command usage to the console
    console.table({
      "Command Name": "server",
      "Command Author": interaction.user.tag,
      "Command Channel": interaction.channel.name,
      "Time Used": new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
      }),
    });
  },
};
