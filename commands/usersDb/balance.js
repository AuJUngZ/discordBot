const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { connectDB } = require("../../functions/functions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance"),
  async execute(interaction) {
    try {
      const client = await connectDB();
      const findUser = await client
        .db("user")
        .collection("userinfo")
        .findOne({ user: interaction.user.tag });
      if (findUser == null) {
        await interaction.reply({
          content: "You don't have user data. Use /createuser to create one.",
          ephemeral: true,
        });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor("#fff")
        .setTitle("Balance")
        .setDescription(`You have \`\`\`${findUser.balance} coins.\`\`\``)
        .setFooter({
          text: "Balance",
        });
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
