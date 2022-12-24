const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomnum")
    .setDescription("Replies with a random number between _min and _max")
    .addIntegerOption((option) =>
      option
        .setName("min")
        .setDescription("The minimum number")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("max")
        .setDescription("The maximum number")
        .setRequired(true)
    ),
  async execute(interaction) {
    const min = interaction.options.getInteger("min");
    const max = interaction.options.getInteger("max");
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    //reply with embed
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Random Number")
      .setDescription(`Your random number is ${randomNum}!`)
      .setTimestamp();
    await interaction.reply({
      embeds: [embed],
    });

    // Log the command usage to the console
    console.log(`
    * ********************************************* *
      ${interaction.user.tag} used the randomnum command
    * ********************************************* *
    `);
  },
};
