const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { connectDB } = require("../../functions/functions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createuser")
    .setDescription("Create a new user data"),
  async execute(interaction) {
    try {
      const client = await connectDB();
      const findUser = await client
        .db("user")
        .collection("userinfo")
        .findOne({ user: interaction.user.tag });
      if (findUser != null) {
        await interaction.reply({
          content: "You already have user data.",
          ephemeral: true,
        });
        return;
      }
      const newUser = {
        user: interaction.user.tag,
        balance: 1000,
        inventory: [],
        level: 1,
        xp: 0,
      };
      const embed = new EmbedBuilder()
        .setColor("#fff")
        .setTitle("User Data Created")
        .setDescription(
          `Your user data has been created. You have been given \`\`\`1000 coins.\`\`\``
        )
        .setFooter({
          text: "User Data Created",
        });
      await client.db("user").collection("userinfo").insertOne(newUser);
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      client.close();
    } catch (err) {
      console.log(err);
    }
  },
};
