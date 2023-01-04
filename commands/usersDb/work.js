const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { connectDB } = require("../../functions/functions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work for coins"),
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
      const work = Math.floor(Math.random() * 1000);
      await client
        .db("user")
        .collection("userinfo")
        .updateOne({ user: interaction.user.tag }, { $inc: { balance: work } });
      const embed = new EmbedBuilder()
        .setColor("#fff")
        .setTitle("Work")
        .setDescription(`You worked and earned \`\`\`${work} coins.\`\`\``)
        .setFooter({
          text: "Work",
        });
      await interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
